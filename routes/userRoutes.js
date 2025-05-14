const express = require('express');
const router  = express.Router();
const User = require('../models/signup');
const {jwtAuthMiddelWare,genToken} = require('../jwt');

router.post('/signup',async(req,res)=>{
    try {
        const userData = req.body;
        const newUser = new User(userData);
        const respon = await newUser.save();
        res.status(200).json({message:"data saved successfully",respon});
        console.log(respon);
    } catch (error) {
        console.log(error);
        res.status(404).json("internal server error");
    }
})

router.post('/login',async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user = await User.findOne({email});
        if(!user|| !(await user.comparePassword(password))){
            res.status(404).json("invalid email or password");
        }
        const payload = {
            id:user.id,
            username:user.username
        }
        const token = genToken(payload);
        console.log(token);
        res.status(200).json({message:"Login successfully",token});
    } catch (error) {
        console.log(error);
        res.status(404).json("internal server error");
    }
})

router.get('/profile',jwtAuthMiddelWare,async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user){
            res.status(404).json("user not found");
        }
        console.log(user);
        res.status(200).json(user)
    } catch (error) {
        console.log(error);
        res.status(404).json("internal server error");
    }
})

router.post('/taskAdd',jwtAuthMiddelWare,async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        const {tasks} = req.body;
        if(!user){
            return res.status(404).json("user not found");
        }
        if(!Array.isArray(tasks)||tasks.lenght===0){
            return res.status(404).json("Task cannot be empty");
        }
        tasks.map((data)=>{
            user.Tasks.push({task:data});
        })
        await user.save();
        res.status(200).json("Task Added");
    } catch (error) {
        console.log(error);
        res.status(404).json("internal server error");
    }
})

router.get('/list',jwtAuthMiddelWare,async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json("user not found");
        }
        const list = user.Tasks.map((t)=>{
            return{
                Task:t.task
            }
        })
        res.status(200).json(list);
    } catch (error) {
        console.log(error);
        res.status(404).json("internal server error");
    }
})

router.put('/update/:taskId',jwtAuthMiddelWare,async(req,res)=>{
    try {
        const userId = req.user.id;
        const taskId = req.params.taskId;
        const updatedTask = req.body.tasks;
        // console.log(updatedTask);
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json("user not found")
        }
        const toDo = user.Tasks.find((t)=>t.id===taskId);
        if (!toDo) {
            return res.status(404).json("Task not found");
        }
        toDo.task = updatedTask;
        await user.save();
        // console.log(toDo.task);

        res.status(200).json({message:"task Updated",updatedTask});
    }   catch(error) {
        console.log(error);
        res.status(404).json("internal server error");
        }
})

router.delete('/deleteTask/:taskId',jwtAuthMiddelWare,async(req,res)=>{
    try {
        const userId = req.user.id;
        const taskId = req.params.taskId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json("user not found");
        }
        const task = user.Tasks.find((t)=>t.id===taskId);
        if(!task){
            return res.status(404).json("task not found");
        }
        const newTodo = user.Tasks.filter((t)=>t.id !== taskId);
        if(newTodo.length==0){
            return res.status(404).json("todo cannot be empty");
        }
        user.Tasks = newTodo;
        await user.save();
        res.status(200).json("task Deleted");
    } catch (error) {
        console.log(error);
        res.status(404).json("internal server error");
    }
})

router.delete('/logout',jwtAuthMiddelWare,async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            return res.status(404).json("user not found")
        }
        res.status(200).json("user deleted");
    } catch (error) {
        console.log(error);
        res.status(404).json("internal server error");
    }
})

module.exports = router;