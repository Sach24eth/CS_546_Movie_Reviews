const express = require("express");
const reviews = require("../data/reviews");

const router = express.Router();

router.get("/:id",async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must provide ID' });
        return;
      }
      try {
        const review = await reviews.getReviewById(req.params.id);
        res.json(review);
      } catch (e) {
        res.status(404).json({ error: e });
      }
  });

router.get("/product/:id",async (req, res) => {
    if (!req.params.id) {
        res.status(400).json({ error: 'You must provide ID' });
        return;
    }
    try {
        const review = await reviews.getReviewbyProductId(req.params.id);
        res.json(review);
    } catch (e) {
        res.status(404).json({ error: 'review not found' });
    }
});

router.get('/', async (req, res) => {
    res.render('review/review');
  });

router.post('/', async (req, res) => {
  console.log(req.body);
  const review = req.body.review;
  const rating = req.body.rating;
  let result;
  try{
    result=await reviews.AddReview("619d59f6ef4d9cffbf59ef13", review, rating);
    console.log(result);
  }catch(e){
    console.log(e);
    res.status(400).render('review/review');
  }
  });

  module.exports = router;