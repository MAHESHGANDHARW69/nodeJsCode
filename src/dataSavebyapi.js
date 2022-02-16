const express = require("express");
const app = express();
app.use(express.json())

//1. connection Established

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/studentdb")
.then(()=>console.log("connection successfully...."))
.catch((err)=>console.log(err))

//2. create document schema or docement structure and we can validate here

const studentSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    class:{
        type:String,
        required:true
    },
    email:String,
    address:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now
    }
}) 

//2. create Model or collection(in other word array of object),model name will be singular and small latter and class must be capital latter of first character

const Student =  mongoose.model('student',studentSchema)

app.post("/record",(req,res)=>{
    const studentInfo = req.body
    res.send(studentInfo)
    const createStudent = async ()=>{
        try{            
            const result = await Student.insertMany([studentInfo]);
            console.log(result)
        }catch(err){
            console.log(err)
        }
    }
    // function calling
    createStudent()
})
app.listen(8000,(err)=>{
    console.log('listening port')
})