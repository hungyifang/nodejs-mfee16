const express = require("express");
const router = express.Router();

router.get("/login", async function (req, res) {
    res.render("./auth/login");
});

router.get("/register", async function (req, res) {
  res.render("./auth/register");
});

router.post("/register", async function (req, res) {
  res.send("123");
});

module.exports = router;
