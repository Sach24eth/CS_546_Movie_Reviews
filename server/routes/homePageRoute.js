const express = require("express");
const router = express.Router();
const products = require("../data/visual/getvisualchartdata");

router.get("/", (req, res) => {
  res.render("homePage/homePage", {
    title: "Home",
    authenticated: req.session.user ? true : false,
    user: req.session.user,
  });
});

router.get("/home", (req, res) => {
  res.render("homePage/homePage", {
    title: "Home",
    authenticated: req.session.user ? true : false,
    user: req.session.user,
  });
});

router.get("/home/chartdata",async (req, res) => {
  try {
    const data = await products.getVisualData();
    res.json(data);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

module.exports = router;
