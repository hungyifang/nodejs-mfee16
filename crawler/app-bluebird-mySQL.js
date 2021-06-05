const axios = require("axios");
const moment = require("moment");
const fs = require("fs");
const Promise = require("bluebird");
const readFileBlueBird = Promise.promisify(fs.readFile);
const mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "stock",
});
connection = Promise.promisifyAll(connection);
connection.connectAsync();

async function stockQuerier() {
  try {
    let stockNo = await readFileBlueBird("stock.txt", "utf8");
    let ckeckDB = await connection.queryAsync(
      `SELECT stock_id,stock_name FROM stock WHERE stock_id='${stockNo}'`
    );
    if (ckeckDB.length === 0) {
      let findStock = await axios.get(
        `https://www.twse.com.tw/zh/api/codeQuery?query=${stockNo}`
      );
      if (findStock.data.suggestions.length > 0) {
        let answer = findStock.data.suggestions
          .map(function (item, index) {
            let stockNo_stockName = item.split("\t");
            return stockNo_stockName;
          })
          .filter(function (value, index, array) {
            return value[0] === stockNo;
          }); //! answer=[[stockNo,stockName]]

        let insertDB = await connection.queryAsync(
          `INSERT INTO stock (stock_id,stock_name) VALUES ('${answer[0][0]}','${answer[0][1]}') `
        );
      }
    }else{
      console.log(ckeckDB);
    }
  } catch {
    console.error(error);
  } finally {
    connection.endAsync();
  }
}
stockQuerier();
