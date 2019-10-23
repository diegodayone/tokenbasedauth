const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalMongoose = require("passport-local-mongoose")

var User = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "user"
    }
})

User.plugin(passportLocalMongoose) //AUTOMATICALLY create username (that must be unique), password (as an hash) and some extra props and salt and _id etc

//instead of saving the password, we're gonna save Hash(Password)
//when we are gonna check the password, we're gonna check Hash(providedPassword) === savedHash

module.exports = mongoose.model("User", User)