const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    desc: {
        type: String,
        default: '',
    },
    dueDate: {
        type: Date,
        default: null,
        required: true
    },
    completionDate: {
        type: Date,
        default: null,
    },
    progress: {
        type: String,
        enum: ['To Do', 'In Progress', 'Completed'],
        default: 'To Do',
    },
    tags: {
        type: [String],
        default: [],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User collection
    }
})

module.exports = mongoose.model("Task", taskSchema)