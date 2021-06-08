const express = require("express");
const app = express();
const port = 3000;

app.use(function (req, res, next) {
  let current = new Date();
  console.log(`有人來訪問了喔 在 ${current}`);
  // 幾乎都要呼叫，讓他往下繼續
  next();
});
app.get("/", (req, res) => {
  res.send("Hello express!");
});

app.get("/about", function (req, res) {
  res.send("About Express AAAAAA");
});

app.get("/test", function (req, res) {
  res.send("Test Express");
});

app.listen(port, () => {
  console.log(`listening :${port}`);
});
