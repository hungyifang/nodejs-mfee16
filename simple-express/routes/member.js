const express = require("express");
const router = express.Router();
const connection = require("../uilts/db.js");

router.get("/", async function (req, res) {
  res.send("123")
});
module.exports = router;
