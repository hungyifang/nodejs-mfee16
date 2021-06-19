const express = require("express");
const router = express.Router();
const connection = require("../uilts/db.js");

router.get("/", async function (req, res) {
  try {
    // await connection.connectAsync();
    let result = await connection.queryAsync(
      `SELECT stock_id,stock_name FROM stock`
    );
    res.render("./stock/list", { stocks: result });
  } catch (err) {
    console.log(err);
  }
});

router.get("/:stockCode", async function (req, res, next) {
  try {
    //做分頁
    const perPage = 10;
    const currentPage = req.query.page || 1;
    //總頁數
    let total = await connection.queryAsync(
      `SELECT COUNT(*) as total FROM stock_price WHERE stock_id=?;`,
      req.params.stockCode
    );
    if (total.length === 0) {
      next();
    }
    total = total[0].total;

    let pages = Math.ceil(total / perPage);
    
    const offset = (currentPage - 1) * perPage;
    // await connection.connectAsync(); 若加此行重新整理造成重複連接會出錯
    let result = await connection.queryAsync(
      `SELECT * FROM stock_price WHERE stock_id=? ORDER BY date LIMIT ? OFFSET ? `,
      [req.params.stockCode, perPage, offset]
    );
    let name = await connection.queryAsync(
      `SELECT * FROM stock WHERE stock_id=?`,
      req.params.stockCode
    );
    name = name[0];
    res.render("./stock/detail", {
      stocks: result,
      info: name,
      total,
      pages,
      currentPage,
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
