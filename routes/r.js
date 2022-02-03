const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const {generatteToken,authenticateToken} = require('../auth/jwt')
const users = require("../database/db")
const todos = require("../database/db")

router.post("/signup",async (req,res)=>{
    try{
        if(req.body.username === undefined || req.body.phone === undefined || req.body.email === undefined || req.body.password === undefined){
            res.send("username,phone, email and password required")
        }else{
        const pass = await bcrypt.hash(req.body.password, 10);
        const userr = new users({
        _id:req.body._id,
        username:req.body.username,
        password:pass,
        email:req.body.email,
        phone:req.body.phone,
        gender:req.body.gender,
        dob:req.body.dob,
        qualification:req.body.qualification
        })
        const data = await users.insertMany(userr)
        console.log("signup succcesfull")
        res.send("signup succesfull")
    }
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})

router.post("/signin",async(req,res)=>{
    try{
        const userdata = await users.findOne({email:req.body.email})
        if(userdata){
            const compare = await bcrypt.compareSync(req.body.password,userdata.password)
            if(compare){
                const token = generatteToken(req.body)
                res.send(token)
                console.log("login succesfull",token)
            }else{
                console.log("wrong password entered")
                res.send("wrong password entered")
            }
        }else{
            res.send("user not found")
            console.log("user not found")
        }
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})

router.post("/todo",authenticateToken,async (req,res)=>{
    try{
        const todo = new todos({
            _id:req.body._id,
            title:req.body.title,
            body:req.body.body
        })
        const data = await todos.insertMany(todo)
        res.send("todo created")
        console.log("todo created")
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})
router.get("/todos",authenticateToken,async (req,res)=>{
    try{
        const data = await todos.find()
        res.send(data)
        console.log(data)
    }
    catch(err){
        res.send(err)
        console.log(err)
    }
})

router.get("/todos/:title",authenticateToken,async (req,res)=>{
    try{
        const data = await todos.findOne({title:req.body.title})
        res.send(data)
        console.log(data)
    }
    catch(err){
        res.send(err)
        console.logI(err)
    }
})

module.exports = router