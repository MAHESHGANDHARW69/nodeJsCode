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

//3. insert data in document by async and await

const createStudent = async ()=>{
    try{
        const studentRecord1 = new Student({
            name:"shubham",
            class:"MCA",
            email:"shubham@gmail.com",
            address:"Indore"
        })
        const studentRecord2 = new Student({
            name:"rahul",
            class:"BBA",
            email:"rahul@gmail.com",
            address:"Indore"
        })
        const studentRecord3 = new Student({
            name:"ishtiyaq",
            class:"MCA",
            email:"khan@gmail.com",
            address:"Indore"
        })
        
        const result = await Student.insertMany([studentRecord1,studentRecord2,studentRecord3]);
        console.log(result)
    }catch(err){
        console.log(err)
    }
}
// function calling
createStudent()

