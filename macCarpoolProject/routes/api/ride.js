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

  //If remianing capcity is 0 then ride can not be selected
  let rideStatus;
  if(req.body.remainingCapacity === "0"){
    rideStatus = true
  }else{
    rideStatus = false
  }

    // New Ride object
    var newRide = {
        "email":req.body.email,
        "locationFrom": req.body.locationFrom,
        "locationTo": req.body.locationTo,
        "rideDate": req.body.rideDate,
        "rideTime": req.body.rideTime,
        "disabled": rideStatus,
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

    res.status(200).send(allRides);

    });
  }


});


// @route PUT api/ride/{rideID}/selectID
// @desc Updates the remiaing capacity of the ride, adds ride to the users selected ride and updates the passenger list
// @access Public
router.post("/selectRide/:id", (req, res) => {
  //Get passenger info and create a passenger object
  let passengerName, passengerEmail, passengerPhone, passengerInfo

  User.findOne({ email:  req.body.email}).then(user => {
    passengerEmail = user.email
    passengerName = user.name
    passengerPhone = user.phone
  

   passengerInfo = {
    passengerName: passengerName,
    passengerEmail: passengerEmail,
    passengerPhone: passengerPhone
  }

  //Update remaining capacity
    User.findOne({"myRides._id":  req.params.id }).then(driver => {
      
      //Check if passeneger email and rider email is same  
      riderEmail = driver.email;
      if(passengerEmail == riderEmail){
        res.status(403).json({Error: 'You can not select your own ride'})
      }else{
        //Get ride with id in params
        ride = driver.myRides.id(req.params.id);
        // Get the passenger list of the ride
        passengerList = ride["passengers"];
        // Get the remaining capacity of the ride
        remainingCapacity = Number(ride["remainingCapacity"]);
        // Get the max capacity of the ride
        maxCapacity = Number(ride["maxCapacity"]);
        // If remaining capcity is left then add the passenger to the ride
        if( remainingCapacity > 0){


          // update the remianing capacity 
          remainingCapacity = maxCapacity - passengerList.length - 1;
          // After updating if the capcity is 0 make the ride disabled for future passengers
          if(remainingCapacity == 0){
            ride["disabled"]= true;
          }
          // Add passneger object to the list and update user
          ride["remainingCapacity"]= remainingCapacity.toString();
          passengerList.push(passengerInfo);
          ride["passengers"] = passengerList
          driver.save();

          const selectedRide = {
            locationFrom: ride["locationFrom"],
            locationTo: ride["locationTo"],
            rideDate: ride["rideDate"],
            rideTime: ride["rideTime"],
            driver: {
              driverName: driver.name,
              driverEmail: driver.email,
              driverPhone: driver.phone
            }
          }
          User.findOne({ email: req.body.email}).then(passenger => {
            selectedRidesList = passenger.selectedRides;
            selectedRidesList.push(selectedRide);
            passenger.save(function(err, updatedPassenger) {
              if (err)
                  res.send(err);
              //Send updated user
              res.status(201).json({ message: 'passenger updated!', data: updatedPassenger });
            });
            
          });


        //If remaining capacity is 0 then send error
        }
        else{
          res.status(403).json({Error: 'Max capacity has been reached'})
        }
      }

    });


  });
  


});






  module.exports = router;