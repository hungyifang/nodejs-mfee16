const express = require("express");
const app = express();
const port = 3000;
// const Promise = require("bluebird");
require("dotenv").config();
// const connection = require("./uilts/db.js");
let stockRouter = require("./routes/stock");
let apiRouter = require("./routes/api");
let authRouter = require("./routes/auth");

// 解讀POST資料
app.use(express.urlencoded({ extended: false }));
//載入靜態檔案
app.use(express.static("public"));

// 第一個是變數 views
// 第二個是檔案夾名稱
app.set("views", "views");
// 告訴 express 我們用的 view engine 是 pug
app.set("view engine", "pug");

app.use(function (req, res, next) {
  let current = new Date();
  console.log(`有人來訪問了喔 在 ${current}`);
  // 幾乎都要呼叫，讓他往下繼續
  next();
});
app.get("/", (req, res) => {
  // res.send("Hello express!");
  res.render("index");
});

app.get("/about", function (req, res) {
  // res.send("About Express");
  res.render("about");
});

app.use("/api", apiRouter); // /api是顯示出來的網址 不是來源的路境

app.use("/stock", stockRouter);

app.use("/auth", authRouter);
// app.get("/stock", async function (req, res) {
//   try {
//     // await connection.connectAsync();
//     let result = await connection.queryAsync(
//       `SELECT stock_id,stock_name FROM stock`
//     );
//     res.render("./stock/list", { stocks: result });
//   } catch (err) {
//     console.log(err);
//   }
// });

// app.get("/stock/:stockCode", async function (req, res) {
//   try {
//     // await connection.connectAsync(); 若加此行重新整理造成重複連接會出錯
//     let result = await connection.queryAsync(
//       `SELECT * FROM stock_price WHERE stock_id=? ORDER BY date`,
//       req.params.stockCode
//     );
//     res.render("./stock/detail", { stocks: result });
//   } catch (err) {
//     console.log(err);
//   }
// });

app.get("/test", function (req, res) {
  res.send("Test Express");
});
// 所有的路由的下面
app.use(function (req, res, next) {
  // 表示前面的路由都找不到
  // http status code: 404
  res.status(404);
  res.send("404");
});

// 500 error
// 放在所有的路由的後面
// 這裡一定要有4個參數-->最後的錯誤處理
app.use(function (err, req, res, next) {
  console.log(err.message);
  res.status(500);
  res.send("500 - Internal Sever Error 請洽系統管理員 XD");
});
app.listen(port, () => {
  console.log(`listening :${port}`);
});
