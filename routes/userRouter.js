const express = require("express")
const User = require("../models/user")
const auth = require("../authenticate")
const passport = require("passport")

const router = express.Router()

router.get("/", async (req, res)=>{
    res.send(await User.find({}));
})

router.post("/register", async (req, res) =>{
    //1) create a new user
    delete req.body.role;
    var newUser =new User(req.body)
    //2) add the user to the collection
    try{
        newUser = await User.register(newUser, req.body.password) ///create the use, checking the unique constraint and password rules
    }
    catch(err){
        res.statusCode = 500;
        res.send(err)
    }

    //3) return a token for further access
    var token = auth.getToken({ _id: newUser._id });
    res.statusCode = 200;
    res.json({
        status: "New user created",
        user: newUser,
        token: token,
        success: true
    })
})

router.post("/login", passport.authenticate("local"), (req, res) =>{ // using local (means username and password) to authorize the method
    var token = auth.getToken({ _id: req.user._id }); //if username and password are correct, i can create a token for the given user
    res.statusCode = 200;
    res.json({  //send the token into the response
        status: "Login OK",
        user: req.user,
        token: token,
        success: true
    })
})

router.post("/refresh", auth.verifyUser, (req, res)=>{ // using jwt (means the token in the authorization header) to create a new token for the user
    var token = auth.getToken({ _id: req.user._id });
    res.statusCode = 200;
    res.json({ //send the token into the response
        status: "New Token Generated",
        user: req.user,
        token: token,
        success: true
    })
})


module.exports = router;
