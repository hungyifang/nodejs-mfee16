//!NodeJS 內建
const http = require("http");

// !createServer(Listener)
// !Listener(request, response) 負責處理進來的連線

const server = http.createServer((req, res) => {
  console.log("有連線!");
  console.log(req.url); //?網址

  res.statusCode = 200;
  res.setHeader("Content-type", "text/plain;charset=UTF-8");

  switch (req.url) {
    case "/":
      res.end("這是首頁");
      break;
    case "/test":
      res.end("這是測試頁面");
      break;
    default:
      res.writeHead(404);
      res.end("Not Found");
  }
});

//! Port

server.listen(3000, () => {
  console.log("收 3000 PORT");
});
