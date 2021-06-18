const express = require("express");
const app = express();
const port = 3000;

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

app.get("/test", function (req, res) {
  res.send("Test Express");
});

app.listen(port, () => {
  console.log(`listening :${port}`);
});
