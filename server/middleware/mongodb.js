const { configDotenv } = require("dotenv");
const mongoose = require("mongoose")
require('dotenv').config

mongoURI = 'mongodb://127.0.0.1:27017/taskManager'

const connectMongoDB = async (req,res,next)=>{
    try {
        if(mongoose.connection.readyState === 0){
            await mongoose.connect(mongoURI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
              });
            console.log("MongoDB connected succesfully");
        }
        next()
    } catch (error) {
        // console.error("MongoDB connection error", error)
        next(error)
    }
}

module.exports = connectMongoDB