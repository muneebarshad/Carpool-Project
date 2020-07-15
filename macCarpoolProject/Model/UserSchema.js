const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const UserSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type:String, required:true},
    phone:{type:String, required:true},
    date: {type: Date, default: Date.now},
    myRides : [{
        locationFrom: {type: String, required: true},
        locationTo: {type: String, required: true},
        rideDate: {type: Date, required: true},
        rideTime: {type: String, required: true},
        email: {type: String, required: true},
        disabled: {type: Boolean, required: true},
        maxCapacity: {type: Number,min: 1, max: 7, required: true},
        remainingCapacity: {type: Number,min: 0, max: 7, required: true},
        date: {type: Date, default: Date.now},
        passengers: [{
            passengerName: {type:String},
            passengerEmail: {type:String},
            passengerPhone: {type:String}
        }]

    }],
    selectedRides : [{
        locationFrom: {type: String, required: true},
        locationTo: {type: String, required: true},
        rideDate: {type: Date, required: true},
        rideTime: {type: String, required: true},
        driver: {
            driverName: {type:String},
            driverEmail: {type:String},
            driverPhone: {type:String}
        }

    }]
});



module.exports = User = mongoose.model("users",UserSchema);