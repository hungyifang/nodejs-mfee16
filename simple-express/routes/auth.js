const express = require("express");
const router = express.Router();
const connection = require("../uilts/db.js");
const moment = require("moment");
const bcrypt = require("bcrypt"); //密碼加密
const path = require("path"); //內建路徑工具
const multer = require("multer");
const myStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // routes/auth.js -> 現在的位置
    // public/uploads -> 希望找到的位置
    // /routes/../public/uploads
    cb(null, path.join(__dirname, "../", "public", "upload"));
  },
  filename: function (req, file, cb) {
    // 抓出副檔名
    console.log(file);
    const ext = file.originalname.split(".").pop();
    // 組合出自己想要的檔案名稱
    cb(null, `${file.fieldname}-${moment().format("YYYYMMDDHHMMSS")}.${ext}`);
  },
});
const uploader = multer({
  storage: myStorage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
      return cb(new Error("不支援的檔案格式"), false);
    }
    // file.originalname: Name of the file on the user's computer
    // 101.jpeg
    if (!file.originalname.match(/\.(jpg|jpeg|png|PNG)$/)) {
      return cb(new Error("是不合格的副檔名"));
    }
    // 檔案ＯＫ, 接受這個檔案
    cb(null, true);
  },
  limits: {
    // 限制檔案的上限 1M
    fileSize: 1024 * 1024,
  },
});

const { body, validationResult } = require("express-validator");
const { connect } = require("../uilts/db.js");

//登入
const loginRules = [
  body("email").isEmail().withMessage("請正確輸入 Email 格式"),
  body("password").isLength({ min: 6 }),
];
router.get("/login", async function (req, res) {
  res.render("./auth/login");
});

router.post("/login", loginRules, async function (req, res, next) {
  const result = validationResult(req.body);
  if (!result.isEmpty()) {
    return next(new Error("帳號密碼格式錯誤"));
  }
  let checkAcc = await connection.queryAsync(
    "SELECT * FROM members WHERE email=?",
    [req.body.email]
  );
  if (checkAcc.length === 0) {
    return next(new Error("查無此帳號"));
  }
  checkAcc = checkAcc[0];
  let compare = await bcrypt.compare(req.body.password, checkAcc.password);
  if (compare !== true) {
    return next(new Error("密碼錯誤"));
  }
  req.session.member = {
    email: checkAcc.email,
    name: checkAcc.name,
    password: checkAcc.password,
  };
  res.redirect(303, "/");
});
//登出
router.get("/logout", async function (req, res) {
  req.session.member = null;//並沒有刪除整個session 只刪除member資料 所以認得ID
  res.redirect(303, "/",);
});
//註冊
router.get("/register", async function (req, res) {
  res.render("./auth/register");
});

//驗證規則
const rules = [
  body("email").isEmail().withMessage("請正確輸入 Email 格式"),
  body("password").isLength({ min: 6 }),
  body("confirmPassword").custom((value, { req }) => {
    return value === req.body.password;
  }),
];

router.post(
  "/register",
  rules,
  uploader.single("photo"),
  async function (req, res, next) {
    console.log(req.body);
    const result = validationResult(req.body);
    console.log(result);

    if (!result.isEmpty()) {
      return next(new Error("資料有誤"));
    }
    let checkDB = await connection.queryAsync(
      "SELECT email FROM members WHERE email=?",
      [req.body.email]
    );
    if (checkDB.length > 0) {
      return next(new Error("註冊過了"));
    }
    let filepath = req.file ? "/upload/" + req.file.filename : null;
    let password = await bcrypt.hash(req.body.password, 10);
    let insertDB = await connection.queryAsync(
      "INSERT INTO members (email,password,name,photo) VALUES (?,?,?,?) ",
      [[req.body.email], [password], [req.body.name], [filepath]]
    );
    res.send("註冊成功");
  }
);

module.exports = router;
