const express = require("express")
const mongoose = require("mongoose")
const config = require("./config")
const userRouter = require("./routes/userRouter")
const auth = require("./authenticate")
const passport = require("passport")
const cors = require("cors")

const connection = mongoose.connect("mongodb+srv://diegostriveschool:h6nxg5U9SDcsLA26@cluster0-3ar0p.azure.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true})
connection.then(db => {
    console.log("database connected")
},
    err=> {   console.log(err) }
)

var server = express()
server.use(cors())
server.use(express.json())
server.use(passport.initialize()) //ENABLE PASSPORT AT A SERVER LEVEL

server.use("/users", userRouter)
server.get("/", (req, res)=>{
    res.send("hellooo")
})

server.listen(3123, ()=>{
    console.log("server is running on 3123")
})