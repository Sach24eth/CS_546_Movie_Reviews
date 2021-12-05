const express = require("express");
const router = express.Router();
const charts = require("../data/visual/getcisualchartdata");
const productData = require("../data/products");

router.get("/", async (req, res) => {
  try {
    let prodList = await productData.getAllProducts();
    //console.log(prodList);
    res.status(200).render("homePage/homePage", {
      title: "Home",
      authenticated: req.session.user ? true : false,
      user: req.session.user,
      error: false,
      products: prodList,
    });
    return;
  } catch (e) {
    console.log(e);
    res.status(404).render("homePage/homePage", {
      title: "Home",
      authenticated: req.session.user ? true : false,
      user: req.session.user,
      error: true,
    });
    return;
  }
});

router.get("/home", async (req, res) => {
  try {
    let prodList = await productData.getAllProducts();
    //console.log(prodList);
    res.status(200).render("homePage/homePage", {
      title: "Home",
      authenticated: req.session.user ? true : false,
      user: req.session.user,
      error: false,
      products: prodList,
    });
  } catch (e) {
    console.log(e);
    res.status(404).render("homePage/homePage", {
      title: "Home",
      authenticated: req.session.user ? true : false,
      user: req.session.user,
      error: true,
    });
  }
});

router.get("/home/chart", async (req, res) => {
  try {
    const chart = await charts.getVisualData();
    res.json(chart);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

module.exports = router;
