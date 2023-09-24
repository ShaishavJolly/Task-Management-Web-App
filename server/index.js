require('dotenv').config();
const express = require('express');
const app = express();
const port = 5000;
const connectMongoDB = require("./middleware/mongodb")
const cors = require("cors")
const cookieParser = require('cookie-parser')

app.use(cors({
    origin: 'https://task-management-web-app-iota.vercel.app',
    credentials: true
}))
app.use(connectMongoDB)
app.use(express.json())
app.use(cookieParser())

const taskRoute = require("./routes/tasks");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");

app.use('/api/tasks', taskRoute)
app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})
