const express = require("express");
const router = express.Router();
const connection = require("../uilts/db.js");

router.get("/stocks", async function (req, res) {
  try {
    // await connection.connectAsync();
    let result = await connection.queryAsync(
      `SELECT stock_id,stock_name FROM stock`
    );
    res.json(result);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;