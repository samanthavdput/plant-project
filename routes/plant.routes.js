const express = require('express');
const router = express.Router();

const Plant = require('../models/Plant.model');
const mongoose = require('mongoose');

// ********* require fileUploader in order to use it *********
const fileUploader = require('../configs/cloudinary.config');

router.get('/plants', (req, res) => {
  Plant.find()
    .then((plantsfromDB) => {
    console.log("found Plants: ", plantsfromDB);
    res.render('users/public-list', { plantsfromDB, userInSession: req.session.currentUser });
})
  .catch((err) => console.error("Error getting the plants", err));
});


router.get('/plants/create', (req, res) => {
  res.render('users/create-plant', { userInSession: req.session.currentUser });
});

router.post("/plants/create", fileUploader.single('image'), (req, res) => {
  const { name, plantCare, placement, observations } = req.body;
  Plant.create({ name, plantCare, placement, observations, imageUrl: req.file.path })
    .then((newPlant) => {
      console.log("New Plant", newPlant);
      res.redirect("/plants");
    })
    .catch((err) => {
      console.log("error creating new Plant:", err);
      res.redirect("/plants/create", { userInSession: req.session.currentUser });
    });
});

module.exports = router;