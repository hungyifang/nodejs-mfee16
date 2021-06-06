//!NodeJS 內建
const http = require("http");
const { URL } = require("url");
const fs = require("fs/promises");
// !createServer(Listener)
// !Listener(request, response) 負責處理進來的連線

const server = http.createServer((req, res) => {
  console.log("有連線!");
  console.log(req.url); //?網址

  //! 將 url 一般化，移除他的 query string、非必要的結尾斜線，並且一率小寫
  const path = req.url.replace(/\/?(?:\?.*)?$/, "").toLocaleLowerCase();
  console.log(`path:${path}`);

  //! 處理 query string URL(input,base)
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(url.searchParams); //?搜尋參數
  //   URL {        //!URL內容
  //   href: 'http://localhost:3000/test',
  //   origin: 'http://localhost:3000',
  //   protocol: 'http:',
  //   username: '',
  //   password: '',
  //   host: 'localhost:3000',
  //   hostname: 'localhost',
  //   port: '3000',
  //   pathname: '/test',
  //   search: '',
  //   searchParams: URLSearchParams {},
  //   hash: ''
  // }

  res.statusCode = 200;
  //! 回應格式
  res.setHeader("Content-type", "text/plain;charset=UTF-8");

  //! 路由
  switch (req.url) {
    case "/":
      res.end("這是首頁");
      break;
    case "/test":
      //! 讀HTML
      res.setHeader("Content-type", "text/html;charset=UTF-8");
      //   let content=await fs.readFile(XXX.html);
      //   res.end(content);
      break;
    case "/about":
      let name = url.searchParams.get("name") || "網友";
      res.end(`嗨,${name}`);
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
