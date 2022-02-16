const express = require("express");
const app = express();

app.use(express.json());

//1. connection Established
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/schooldb")
    .then(() => console.log("Database connected successfully...."))
    .catch((err) => console.log(err))

//2. create document schema or docement structure and we can validate here
const studentSchema = new mongoose.Schema({
    student_name:{type:String,required:true},
    class_id:{type:String,required:true},
    student_email:{type:String,required:true,unique:true},
    gender:{type:String,required:true},
    address:{type:String,required:true},
    created_date: {
        type: Date,
        default: Date.now
    },
})    

//3. create Model or collection(in other word array of object),model name will be singular and small latter and class must be capital latter of first character
const Student = mongoose.model('student', studentSchema);

app.post("/savestudentinfo",async(req,res)=>{
    try{
        const {student_name,class_id,student_email,gender,address} = req.body;
        if (!(student_name && class_id && student_email && gender && address)) {
            res.status(400).send("All input is required");
        }
        const existEmail = await Student.findOne({ student_email });
        if (existEmail) {
            return res.status(409).json({msg:"Email Already Exist."});
        }
        const studentRecord = new Student({
            student_name:student_name,
            class_id:class_id,
            student_email:student_email,
            gender:gender,
            address:address
        })
        studentRecord.save(function(error,data){
            res.status(201).json({data:data,msg:"Data saved successfully"})
        })
    }catch(err){
        console.log(err)
    }
})


app.listen(6500,(error)=>{
    console.log("Application running on port no 6500")
})