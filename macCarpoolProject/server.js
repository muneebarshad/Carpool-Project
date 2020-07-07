const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require("passport");

const app = express();

app.use(
    bodyParser.urlencoded({
        extended:false
    })
);

app.use(bodyParser.json());

// DB config

const dbKeys = require("./config/keys").mongoURI;

mongoose.connect( 
        dbKeys, 
        {useNewUrlParser: true}
)
.then(() => console.log("mongoDB connected successfully"))
.catch(err =>console.log(err));


// Passport middleware
app.use(passport.initialize());
// Passport config
require("./config/passport")(passport);

//Routes
app.use("/api/users", require('./routes/api/users'));
app.use("/api/ride", require('./routes/api/ride'));



// Run on server

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})







