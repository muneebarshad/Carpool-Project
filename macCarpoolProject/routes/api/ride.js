const express = require("express");
const router = express.Router();


// Load User model
const User = require("../../Model/UserSchema");
const { reset } = require("nodemon");


// @route PUT api/ride/createRide
// @desc Create Ride for the specific User
// @access Public
router.put("/createRide", (req, res) => {
    // New Ride object
    var newRide = {
        "email":req.body.email,
        "locationFrom": req.body.locationFrom,
        "locationTo": req.body.locationTo,
        "rideDate": req.body.rideDate,
        "disabled": false,
        "maxCapacity": 4,
        "remainingCapacity": 4

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





  module.exports = router;