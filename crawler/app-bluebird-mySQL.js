const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const Promise = require("bluebird");
const readFileBlueBird = Promise.promisify(fs.readFile);
const mysql = require("mysql");
require("dotenv").config();

let connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
connection = Promise.promisifyAll(connection);
connection.connectAsync();

async function stockQuerier() {
  try {
    //*檢查DB有無股票代碼資料
    let stockNo = await readFileBlueBird("stock.txt", "utf8");
    stockNo = stockNo.split("\r\n");

    let ckeckPromise = stockNo.map((item) => {
      return connection.queryAsync(
        `SELECT stock_id,stock_name FROM stock WHERE stock_id=?`,
        [item]
      );
    });
    //* 複數結果丟入查詢去除空值,若長度小於原本輸入資料值則表示輸入值有資料庫沒有的->輸入資料庫(只要有沒有的就統一輸入)

    let checkStatus = await Promise.all(ckeckPromise).filter((value) => {
      return value.length > 0;
    });

    if (checkStatus.length < stockNo.length) {
      let findStock = stockNo.map((item) => {
        return axios.get(
          `https://www.twse.com.tw/zh/api/codeQuery?query=${item}`
        );
      });
      let findResult = await Promise.all(findStock);
      findResult.forEach((item) => {
        if (item.data.suggestions[0] === "(無符合之代碼或名稱)") {
          throw "查無「"+item.data.query+"」此股票代碼!";
        }
      });
      //* 整理資料格式
      let result = findResult
        .map((items) => {
          let query = items.data.query;
          let answer = items.data.suggestions
            .map((values) => {
              let stockNo_stockName = values.split("\t");
              return stockNo_stockName;
            })
            .filter((item) => {
              return item[0] === query;
            });
          return answer;
        })
        .flat();
      // console.log(result); //!  [ [ '2330', '台積電' ], [ '2610', '華航' ] ]

      //* 複數資料輸入資料庫
      let insertPromise = result.map((item) => {
        return connection.queryAsync(
          `INSERT IGNORE INTO stock (stock_id,stock_name) VALUES ? `,
          [[item]]
        );
      });
      let insertDB = await Promise.all(insertPromise);
    }

    //* API查詢交易資料,輸入資料庫
    let stockDataPromise = stockNo.map((item) => {
      return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY?", {
        params: {
          response: "json",
          date: moment().format("YYYYMMDD"),
          stockNo: item,
        },
      });
    });
    let stockData = await Promise.all(stockDataPromise);
    stockData.forEach((item) => {
      if (item.data.stat !== "OK") {
        throw "查詢股價失敗!";
      }
    });

    let refineData = stockData.map((items) => {
      let title = items.data.title.split(" ");
      items = items.data.data.map((item) => {
        item = item.map((value) => {
          return value.replace(/,/g, "");
        });
        item[0] = parseInt(item[0].replace(/\//g, "")) + 19110000;
        item[0] = moment(item[0], "YYYYMMDD").format("YYYY-MM-DD");
        item.unshift(title[1]);
        return item;
      });
      return items;
    });

    let insertDataPromise = refineData.map((item) => {
      return connection.queryAsync(
        `INSERT IGNORE INTO stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?`,
        [item]
      );
    });
    let insertData = await Promise.all(insertDataPromise);
    console.log("輸入資料庫成功");
  } catch (err){
    console.error("錯誤:"+err);
  } finally {
    connection.endAsync();
  }
}
stockQuerier();
