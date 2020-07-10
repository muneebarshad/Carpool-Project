const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateCreateRide(data) {
  let errors = {};

  // Convert empty fields to an empty string so we can use validator functions
  data.locationFrom = !isEmpty(data.locationFrom) ? data.locationFrom : "";
  data.locationTo = !isEmpty(data.locationTo) ? data.locationTo : "";
  data.rideDate = !isEmpty(data.rideDate) ? data.rideDate : "";
  data.rideTime = !isEmpty(data.rideTime) ? data.rideTime : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.maxCapacity = !isEmpty(data.maxCapacity) ? data.maxCapacity : "";


  // Email checks
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  // rideDate checks
  if (Validator.isEmpty(data.rideDate)) {
    errors.rideDate = "Ride date is required";
  }else if (!Validator.isDate(data.rideDate)) {
    errors.rideDate = "Ride date is invalid";
  }

   // rideTime checks
   if (Validator.isEmpty(data.rideTime)) {
    errors.rideTime = "Ride time is required";
  }

    // locationFrom checks
   if (Validator.isEmpty(data.locationFrom)) {
    errors.locationFrom = "Location is required";
  }


  // locationTo checks
  if (Validator.isEmpty(data.locationTo)) {
    errors.locationTo = "Location is required";
    }


    // maxCapcity checks
  if ((data.maxCapacity) == ("...") || Validator.isEmpty(data.maxCapacity) ) {
    errors.maxCapacity = "Capacity is required";
    }

 



  return {
    errors,
    isValid: isEmpty(errors)
  };
};