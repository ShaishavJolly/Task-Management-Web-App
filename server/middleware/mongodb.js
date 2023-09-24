const mongoose = require("mongoose")

// mongoURI = 'mongodb://127.0.0.1:27017/taskManager'
const databaseName = process.env.DBNAME
const databaseUser = process.env.DBUSER
const databasePassword = process.env.DBPASS

const mongoURI = 'mongodb+srv://shaishavjolly2003:Shavjoll%402003@cluster0.crpysbc.mongodb.net/taskManager'

// const mongoURI = `mongodb+srv://${databaseUser}:${databasePassword}@cluster0.crpysbc.mongodb.net/${databaseName}`

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
        next(error)
    }
}

module.exports = connectMongoDB