const passport = require("passport")
const User = require("../models/user")
const JwtStrategy = require("passport-jwt").Strategy  //import token Strategy (passport way to handle tokens)
const ExtractJwt = require("passport-jwt").ExtractJwt //import the extraction tool for token to JSON
const LocalStrategy = require("passport-local").Strategy //import local username + password strategy from passport
const jwt = require("jsonwebtoken") //token generator

passport.serializeUser(User.serializeUser()) //how the passport will handle the user serialization (OOTB)
passport.deserializeUser(User.deserializeUser()) //how the passport wil handle the user deserialization (OOTB)
passport.use(new LocalStrategy(User.authenticate())) //enable the username + password verification for passport

var options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //this will tell JWT strategy to check in Authorization: Bearer TOKEN
    secretOrKey: "123123123123123123123123" //this should be stored in a very secret place!
}

module.exports = {
    getToken: (user) => { //Will generate a token using jwt. In the token we will find the USER object, and it's encrypted with the secretKey and will expire in 1h
        return jwt.sign(user, options.secretOrKey, { expiresIn: 3600 }) 
    },
    verifyUser: passport.authenticate("jwt", { session: false}), //syntactic sugar for enpoints to use jwt to check the token
    jwtPassport: 
        passport.use( new JwtStrategy(options, (jwt_payload, done) =>  //defines what happens when we deserialize a token
        {
            User.findById(jwt_payload._id, (err, user) =>{ //search the db for a given user
                if (err)
                    return done(err, false) //3) token is expired or some other errors
                else if (user)
                    return done(null, user)  //2) user is correct
                else 
                    return (null, false)  //1) user not found
            })
    }))
}