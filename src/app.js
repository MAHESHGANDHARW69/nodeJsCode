const express = require("express");
const app = express();
app.use(express.json())

//1. connection Established

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/studentdb")
.then(()=>console.log("connection successfully...."))
.catch((err)=>console.log(err))

//2. create document schema or docement structure and we can validate here

const employeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:String,
    address:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default: Date.now
    }
}) 

//2. create Model or collection(in other word array of object),model name will be singular and small latter and class must be capital latter of first character

const Employee =  mongoose.model('employee',employeeSchema)

// app.post("/register",(req,res)=>{
//     const employeeInfo = req.body    
//     if(!employeeInfo.name || !employeeInfo.phone || !employeeInfo.gender){
//         console.log('All fields have required!')
//         res.send('All fields have required!')              
//     }else{
//         // res.send(employeeInfo)
//         // console.log(employeeInfo)
//         var empRecord = new Employee({
//             name:employeeInfo.name,
//             phone:employeeInfo.phone,
//             email:employeeInfo.email,
//             address:employeeInfo.address,
//             gender:employeeInfo.gender
//         })
//         empRecord.save((err,Employee)=>{
//             if(err){
//                 res.send(err)
//             }else{
//                 res.send(Employee)
//             }
//         });
//     }
// })
app.get("/getuser",(req,res)=>{
    try{
        const getRecord= async()=>{
            const result = await Employee.find().select({_id:0,name:1}).limit(1)
            res.send(result)
            console.log(result)
        }
        getRecord()
    }catch(err){
        console.log(err)
    }
    
})
app.listen(8000,(err)=>{
    console.log('listening port 8000')
})