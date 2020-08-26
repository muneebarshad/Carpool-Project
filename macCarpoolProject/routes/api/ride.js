const express = require("express");
const router = express.Router();
const isEmpty = require("is-empty");
const jwt = require('jsonwebtoken');
const keys = require("../../config/keys");

//Validation import
const validateCreateRide = require("../../validation/createRide");

// Load User model
const User = require("../../Model/UserSchema");
const { reset } = require("nodemon");

//Check to make sure header is not undefined, if so, return Forbidden (403)
const checkToken = (req, res, next) => {
  const header = req.headers['authorization'];

  if(typeof header !== 'undefined') {
      const bearer = header.split(' ');
      const token = bearer[1];

      req.token = token;
      next();
  } else {
      //If header is undefined return Forbidden (403)
      res.sendStatus(403)
  }
}



// @route PUT api/ride/createRide
// @desc Create Ride for the specific User
// @access Public
router.post("/createRide", checkToken, (req, res) => {
  jwt.verify(req.token, keys.secretOrKey, (err, authorizedData) => {
    if(err){
        //If error send Forbidden (403)
        console.log('ERROR: Could not connect to the protected route');
        res.sendStatus(403);
    } 
    else {

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
          "remainingCapacity": req.body.remainingCapacity,
          "selected":false

        };
        // Find a user with specific email and add ride to the user
        User.findOneAndUpdate({ email: req.body.email}, {$push: {myRides: newRide} }).then(user => {
          // Find the user and return the response
            User.findOne({email:req.body.email}).then(user => {
                res.status(200).send(user.myRides)
            });

        });
    }
  })    
});


// @route Get api/ride/getRides - protect API
// @desc Get all rides object in an array
// @access Public
router.get("/getRides", checkToken, (req, res) => {
  //verify the JWT token generated for the user

  jwt.verify(req.token, keys.secretOrKey, (err, authorizedData) => {
    if(err){
        //If error send Forbidden (403)
        console.log('ERROR: Could not connect to the protected route');
        res.sendStatus(403);
    } else {

      
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
       
    }
})


});

// @route Delete api/ride/removeRide
// @desc Remove Ride (request body requires email and ride ID)
// @access Public
router.delete("/removeRide", checkToken, (req, res) => {

  jwt.verify(req.token, keys.secretOrKey, (err, authorizedData) => {
    if(err){
        //If error send Forbidden (403)
        console.log('ERROR: Could not connect to the protected route');
        res.sendStatus(403);
    } else {
      const email = authorizedData.email

      User.findOneAndUpdate({ email: email}, { $pull : {myRides: { _id: req.body.id } }}).then(user => {
        User.findOne({ email: email}).then(user =>{
          res.send(user.myRides)
        })
      });
        
    }
  })


    
});


// @route POST api/ride/getMyRides
// @desc POST user rides object in an array
// @access Public
router.post("/getMyRides", checkToken, (req, res) => {
  jwt.verify(req.token, keys.secretOrKey, (err, authorizedData) => {
    if(err){
        //If error send Forbidden (403)
        console.log('ERROR: Could not connect to the protected route');
        res.sendStatus(403);
    } 
    else {
      const email = authorizedData.email
      // Find all rides for users
      User.findOne({email: email}).then(user => {
      // Create an object all rides
      const allRides = [];
      // For each user push the ride to allRides object
      for (let index = 0; index < user.myRides.length; index++) {
      allRides.push(user.myRides[index]);
      }
  
      res.status(200).send(allRides);
  
      });
      
        
    }
  })

  

});



// @route GET api/ride/test
// @desc TEST for secure routes
// @access Public
  //This is a protected route 
  router.get('/test', checkToken, (req, res) => {
    //verify the JWT token generated for the user
    jwt.verify(req.token, keys.secretOrKey, (err, authorizedData) => {
        if(err){
            //If error send Forbidden (403)
            console.log('ERROR: Could not connect to the protected route');
            res.sendStatus(403);
        } else {
            //If token is successfully verified, we can send the autorized data 
            res.json({
                message: 'Successful log in',
                authorizedData
            });

            console.log('SUCCESS: Connected to protected route');
        }
    })
});




// @route POST api/ride/getSelectedRides
// @desc Updates the selected ride array of the user and returns the user schema (res should path to data.selectedRides)
// @access Public
router.post("/getSelectedRides", checkToken , (req, res) => {
  jwt.verify(req.token, keys.secretOrKey, (err, authorizedData) => {
    if(err){
        //If error send Forbidden (403)
        console.log('ERROR: Could not connect to the protected route');
        res.sendStatus(403);
    } else {
        const allRidesId = [];
 
        // /Check if Ride does not exists then delete the ride from selectedRide away from the user goven in the request body
        // Store all rides into an array
        User.find({}).then(users => { 
          users.forEach((user) => {
            for (let index = 0; index < user.myRides.length; index++) {
              allRidesId.push(user.myRides[index]._id.toString());
            }
          });
          
          // If the selectedRides are not in the All rides array then pull and save in database
          User.findOne({email: authorizedData.email}).then(user => {
            selectedRidesList = user.selectedRides;
            for (let index = 0; index < selectedRidesList.length; index++) {
              selectedRideID = selectedRidesList[index]._id.toString();
              if(!allRidesId.includes(selectedRideID)){
                selectedRidesList.pull(selectedRidesList[index])
              }
            }

            user.save(function(err, data) {
              if (err)
                  res.send(err);
              //Send updated user
              res.status(200).send({ data });
            });
          });
        })
  
        
    }
})
  
});


// @route POST api/ride/{rideID}/selectID
// @desc Updates the remiaing capacity of the ride, adds ride to the users selected ride and updates the passenger list
// @access Public
router.post("/selectRide/:id", checkToken, (req, res) => {
  jwt.verify(req.token, keys.secretOrKey, (err, authorizedData) => {
    if(err){
        //If error send Forbidden (403)
        console.log('ERROR: Could not connect to the protected route');
        res.sendStatus(403);
    } else {
        //Get passenger info and create a passenger object
        let passengerName, passengerEmail, passengerPhone, passengerInfo

        User.findOne({ email:  authorizedData.email}).then(user => {
          passengerEmail = user.email
          passengerName = user.name
          passengerPhone = user.phone

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

              passengerInfo = {
                _id: ride["_id"],
                passengerName: passengerName,
                passengerEmail: passengerEmail,
                passengerPhone: passengerPhone
              }


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
                  _id: ride["_id"],
                  driver: {
                    driverName: driver.name,
                    driverEmail: driver.email,
                    driverPhone: driver.phone
                  }
                }
                User.findOne({ email: authorizedData.email}).then(passenger => {
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
        
    }
})

});



// @route POST api/ride/{rideID}/selectID
// @desc Updates the remiaing capacity of the ride, adds ride to the users selected ride and updates the passenger list
// @access Public
router.post("/unselectRide/:id", checkToken, (req, res) => {
  jwt.verify(req.token, keys.secretOrKey, (err, authorizedData) => {
    if(err){
        //If error send Forbidden (403)
        console.log('ERROR: Could not connect to the protected route');
        res.sendStatus(403);
    } else {
        //Get passenger info and create a passenger object
        let passengerName, passengerEmail, passengerPhone, passengerInfo

        User.findOne({ email:  authorizedData.email}).then(user => {
          passengerEmail = user.email
          passengerName = user.name
          passengerPhone = user.phone

        //Update remaining capacity
          User.findOne({"myRides._id":  req.params.id }).then(driver => {            
              //Get ride with id in params
              ride = driver.myRides.id(req.params.id);
              // Get the passenger list of the ride
              passengerList = ride["passengers"];
              // Get the remaining capacity of the ride
              remainingCapacity = Number(ride["remainingCapacity"]);
              // Get the max capacity of the ride
              maxCapacity = Number(ride["maxCapacity"]);

              passengerInfo = {
                _id: ride["_id"],
                passengerName: passengerName,
                passengerEmail: passengerEmail,
                passengerPhone: passengerPhone
              }

              
              // If remaining capcity is left then add the passenger to the ride
              if( remainingCapacity < maxCapacity){


                // update the remianing capacity 
                remainingCapacity = maxCapacity -  passengerList.length + 1;
                // After updating if the capcity is 0 make the ride disabled for future passengers
                if(remainingCapacity != 0){
                  ride["disabled"]= false;
                }
                // Add passneger object to the list and update user
                ride["remainingCapacity"]= remainingCapacity.toString();
                passengerList.pull(passengerInfo);
                ride["passengers"] = passengerList
                driver.save();
                const selectedRide = {
                  locationFrom: ride["locationFrom"],
                  locationTo: ride["locationTo"],
                  rideDate: ride["rideDate"],
                  rideTime: ride["rideTime"],
                  _id: ride["_id"],
                  driver: {
                    driverName: driver.name,
                    driverEmail: driver.email,
                    driverPhone: driver.phone
                  }
                }
                User.findOne({ email: authorizedData.email}).then(passenger => {
                  selectedRidesList = passenger.selectedRides;
                  selectedRidesList.pull(selectedRide);
                  passenger.save(function(err, updatedPassenger) {
                    if (err)
                        res.send(err);
                    //Send updated user
                    res.status(201).json({ message: 'passenger updated!', data: updatedPassenger });
                  });
                  
                });

              //If remaining capacity is 0 then send error
              }

          });
        });
        
    }
})

});



// @route GET api/ride/getSelectedRides/driverInfo/:id
// @desc Get the driver info of the rides
// @access Public
router.get("/getSelectedRides/driverInfo/:id", checkToken , (req, res) => {
  jwt.verify(req.token, keys.secretOrKey, (err, authorizedData) => {
    if(err){
        //If error send Forbidden (403)
        console.log('ERROR: Could not connect to the protected route');
        res.sendStatus(403);
    } else {

      User.findOne({"selectedRides._id":  req.params.id }).then(user => {
        driver = user.selectedRides.id(req.params.id).driver;
        res.status(200).json(driver);

      })
    }
})
  
});


// @route GET api/ride//getMyRides/passengerList/:id
// @desc Get the passeneger List of the ride
// @access Public
router.get("/getMyRides/passengerList/:id", checkToken , (req, res) => {
  jwt.verify(req.token, keys.secretOrKey, (err, authorizedData) => {
    if(err){
        //If error send Forbidden (403)
        console.log('ERROR: Could not connect to the protected route');
        res.sendStatus(403);
    } else {

      User.findOne({"myRides._id":  req.params.id }).then(user => {
        passengerList = user.myRides.id(req.params.id).passengers;
        res.status(200).json(passengerList);

      })
    }
})
  
});









  module.exports = router;