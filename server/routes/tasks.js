const express = require('express');
const router  = express.Router();
const Task = require("../models/task");
const auth = require('../middleware/auth');

router.get('/',auth,async (req,res)=>{
    try {
        const tasks = await Task.find({ user: req.user.id })
        res.status(200).json(tasks)
        
    } catch (error) {
        res.status(500).json({"error": error})
    }
})
router.get('/:id',auth,async (req,res)=>{
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.user.id })
        if(!task){
            res.status(404).json({error: "task not found"})
        }
        else{
            res.status(200).json(task)
        }
        
    } catch (error) {
        res.status(500).json({"error": error})
    }
})
router.post('/',auth,async (req,res)=>{
    try{
        const taskData = req.body
        const newTask = new Task({ ...taskData, user: req.user.id })
        await newTask.save()
        res.status(200).json({"message": "Task added sucessfully"})
    }
    catch(error){
        res.status(500).json({"error": "Internal Server error"})
    }

})

router.put('/:id',auth,async (req,res)=>{
    try {
        const taskId = req.params.id;
        const taskData = req.body;
    
        const updatedTask = await Task.findOneAndUpdate(
          { _id: taskId, user: req.user.id },
          taskData,
          { new: true }
        )

        if(!updatedTask){
            res.status(404).json({error: "Task not found"})
        }
        res.status(200).json({message: "task updated succesfully", task: updatedTask})
    } catch (error) {
        res.status(500).json({"error": "Internal Server error"})
    }
})

router.delete('/:id',auth,async (req,res)=>{
    try {
        const taskId = req.params.id
        const deletedTask = await Task.findOneAndDelete({ _id: taskId, user: req.user.id })
        res.status(200).json({message: "task deleted succesfully", task: deletedTask})
    } catch (error) {
        res.status(500).json({"error": "Internal Server error"})
    }
})

module.exports = router;