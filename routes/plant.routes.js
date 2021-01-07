const express = require('express');
const router = express.Router();

const Plant = require('../models/Plant.model');
const User = require('../models/User.model');
const mongoose = require('mongoose');

// ********* require fileUploader in order to use it *********
const fileUploader = require('../configs/cloudinary.config');

router.get('/plants', (req, res) => {
  Plant.find()
    .then((plantsfromDB) => {
    console.log("found Plants: ", plantsfromDB);
    res.render('users/public-list', { userInSession: req.session.currentUser, plantsfromDB });
})
  .catch((err) => console.error("Error getting the plants", err));
});

router.get('/your-plants', (req, res) => {
  console.log(".....");
  console.log(req.session.currentUser._id);
  User
   .findById(req.session.currentUser._id)
   .populate("plants") // key to populate
   .then(user => {
      console.log(user);
      res.render('users/private-list', { userInSession: req.session.currentUser, plantsfromUser: user.plants });
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
      return User.findByIdAndUpdate(req.session.currentUser._id, {$push:{plants: newPlant._id}})
    })
    .then( () => res.redirect("/your-plants") )
    .catch((err) => {
      console.log("error creating new Plant:", err);
      res.redirect("/plants/create", { userInSession: req.session.currentUser });
    });
});

/* GET Plant Details page by Id*/
router.get("/plants/:id", (req, res, next) => {
  const id = req.params.id;
  Plant.findById(id)
    .then((plantDetails) => {
      console.log("Plant Details: ", plantDetails);
      res.render("users/plant-details", { plantDetails });
    })
    .catch((err) =>
      console.error("Error getting the plants details page", err)
    );
});

// Edit plants
router.get('/plants/:id/edit', (req, res) => {
  const id = req.params.id;
  Plant.findById(id)
    .then(plantToEdit => {
      console.log(plantToEdit);
      res.render('users/update-plant', { userInSession: req.session.currentUser, plantToEdit });
    })
    .catch(error => console.log(`Error while getting a plant for edit: ${error}`));
});

router.post('/plants/:id/edit', (req, res) => {
  const  id  = req.params.id;
 
  Plant.findByIdAndUpdate(id, req.body, { new: true })
  .then(updatedPlant => res.redirect(`/plants/${updatedPlant._id}`))
  .catch(error => console.log(`Error while updating a plant: ${error}`));
});

// Delete plants
router.post('/plants/:id/delete', (req, res) => {
  const { id } = req.params;
 
  Plant.findByIdAndDelete(id)
    .then(() => res.redirect('/plants'))
    .catch(error => console.log(`Error while deleting a plant: ${error}`));
});

module.exports = router;