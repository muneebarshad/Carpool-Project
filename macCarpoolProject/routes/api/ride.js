const express = require("express");
const router = express.Router();
const isEmpty = require("is-empty");


//Validation import
const validateCreateRide = require("../../validation/createRide");

// Load User model
const User = require("../../Model/UserSchema");
const { reset } = require("nodemon");


// @route PUT api/ride/createRide
// @desc Create Ride for the specific User
// @access Public
router.post("/createRide", (req, res) => {

    const { errors, isValid } = validateCreateRide(req.body);

    // Check validation
    if (!isValid) {

      //403 forbidden
    return res.status(400).json(errors);
  }

    // New Ride object
    var newRide = {
        "email":req.body.email,
        "locationFrom": req.body.locationFrom,
        "locationTo": req.body.locationTo,
        "rideDate": req.body.rideDate,
        "rideTime": req.body.rideTime,
        "disabled": req.body.disabled,
        "maxCapacity": req.body.maxCapacity,
        "remainingCapacity": req.body.remainingCapacity

      };
      // Find a user with specific email and add ride to the user
      User.findOneAndUpdate({ email: req.body.email}, {$push: {myRides: newRide} }).then(user => {
        // Find the user and return the response
          User.findOne({email:req.body.email}).then(user => {
               res.status(200).send(user.myRides)
          });

      });

  });


// @route Get api/ride/getRides
// @desc Get all rides object in an array
// @access Public
router.get("/getRides", (req, res) => {
    // Find all rides for users
    User.find({}).then(users => {
          // Create an object all rides

    const allRides = [];
    // For each user push the ride to allRides object
    users.forEach((user) => {
      for (let index = 0; index < user.myRides.length; index++) {
        allRides.push(user.myRides[index]);
     
      }
    });

    // Response all rides
    res.status(200).send(allRides);

    });

});

// @route Delete api/ride/removeRide
// @desc Remove Ride
// @access Public
router.delete("/removeRide", (req, res) => {
    User.findOneAndUpdate({ email: req.body.email}, { $pull : {myRides: { _id: req.body.id } }}).then(user => {
      User.findOne({ email: req.body.email}).then(user =>{
        res.send(user.myRides)
      })
    });
});


// @route Get api/ride/getRides
// @desc Get user rides object in an array
// @access Public
router.post("/getMyRides", (req, res) => {
  if(isEmpty(req.body.email)){
     res.status(403).send("Email is required")
  }
  else{
      // Find all rides for users
    User.findOne({email: req.body.email}).then(user => {
    // Create an object all rides
    const allRides = [];
    // For each user push the ride to allRides object
    for (let index = 0; index < user.myRides.length; index++) {
    allRides.push(user.myRides[index]);
    }

    if(allRides.length == 0){
      res.status(200).send("You have created no Rides")
    }else{
    // Response all rides
      res.status(200).send(allRides);
    }

    });
  }


});






  module.exports = router;