const express = require("express");
const app = express();
app.use(express.json());

//1. connection Established
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/schooldb")
    .then(() => console.log("database connected successfully...."))
    .catch((err) => console.log(err))

//2. create document schema or docement structure and we can validate here
const classSchema = new mongoose.Schema({
    class_name: { type: String, required: true, unique: true },
    num_of_student: { type: Number, required: true },
    medium: { type: String, required: true },
    section: { type: String, required: true },
    date: {
        type: Date,
        default: Date.now
    },
})

//3. create Model or collection(in other word array of object),model name will be singular and small latter and class must be capital latter of first character
const Class = mongoose.model('class', classSchema);

//2. create document schema or docement structure and we can validate here
const studentSchema = new mongoose.Schema({
    student_name: { type: String, required: true },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', },
    student_email: { type: String, required: true, unique: true },
    gender: { type: String, required: true },
    address: { type: String, required: true },
    created_date: {
        type: Date,
        default: Date.now
    },
})

//3. create Model or collection(in other word array of object),model name will be singular and small latter and class must be capital latter of first character
const Student = mongoose.model('student', studentSchema);

//2. create document schema or docement structure and we can validate here
const teacherSchema = new mongoose.Schema({
    teacher_name: { type: String, required: true },
    class_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', },
    subject_teacher: { type: String, required: true },
    created_date: {
        type: Date,
        default: Date.now
    },
})
const Teacher = mongoose.model('teacher', teacherSchema);

app.post("/insertclass", async (req, res) => {
    try {
        const { class_name, num_of_student, medium, section } = req.body;
        if (!(class_name && num_of_student && medium && section)) {
            res.status(400).send("All input is required");
        }
        const existClass = await Class.findOne({ class_name });
        if (existClass) {
            return res.status(409).send("Class Already Exist.");
        }
        const classRecord = new Class({
            class_name: class_name,
            num_of_student: num_of_student,
            medium: medium,
            section: section
        })
        classRecord.save(function (err, data) {
            res.status(201).json({ data: data, msg: "data saved successfully" })
        })
    } catch (err) {
        console.log(err);
    }
})

app.post("/updateclass", async (req, res) => {
    try {
        const { class_name, num_of_student, medium, section } = req.body;
        let student = await Class.findOneAndUpdate({ class_name: class_name }, {
            class_name: class_name,
            num_of_student: num_of_student,
            medium: medium,
            section: section
        }, { new: true });
        res.status(200).json({ data: student, msg: "Data updated successfully" })
    } catch (err) {
        console.log(err)
    }
})

app.post("/savestudentinfo", async (req, res) => {
    try {
        const { student_name, class_id, student_email, gender, address } = req.body;
        if (!(student_name && student_email && gender && address)) {
            res.status(400).send("All input is required");
        }
        const existEmail = await Student.findOne({ student_email });
        if (existEmail) {
            return res.status(409).json({ msg: "Email Already Exist." });
        }
        const studentRecord = new Student({
            student_name: student_name,
            class_id: class_id,
            student_email: student_email,
            gender: gender,
            address: address
        })
        studentRecord.save(function (error, data) {
            res.status(201).json({ data: data, msg: "Data saved successfully" })
        })
    } catch (err) {
        console.log(err)
    }
})

app.post("/saveteacherinfo", async (req, res) => {
    try {
        const { teacher_name, class_id, subject_teacher} = req.body;
        if (!(teacher_name && subject_teacher)) {
            res.status(400).send("All input is required");
        }
        const teacherRecord = new Teacher({
            teacher_name: teacher_name,
            class_id: class_id,
            subject_teacher:subject_teacher
        })
        teacherRecord.save(function (error, data) {
            res.status(201).json({ data: data, msg: "Data saved successfully" })
        })
    } catch (err) {
        console.log(err)
    }
})

//aggregation and join two collection in mongo
app.get("/getinfo", async (req, res) => {
    try {
        // const class_id = req.params.myclassid;
        // console.log(class_id)
        // const result = await Student.find().select({student_name:1}).sort({student_name:1});
        // console.log(result)
        // res.status(200).json(result)
        Class.aggregate([
            {
                '$lookup': {
                    'from': 'students',//other table name
                    'localField': '_id',//name of class table field
                    'foreignField': 'class_id',//name of student table field
                    'as': 'studentdetails'//for join data store i have use studentdetails variable
                },                
            },
            {
                $unwind: "$studentdetails",
            },
            {
                '$lookup': {
                    'from': 'teachers',
                    'localField': '_id',
                    'foreignField': 'class_id',
                    'as': 'students.teacherdetails'
                },
            },
        ]).exec((err, result) => {
            if (err) {
                console.log("error", err)
            }
            if (result) {
                res.status(201).json(result)
                console.log(result);
            }
        })
    } catch (err) {
        console.log(err)
    }
})

//pagination set with limit
app.get("/getpaginationdata", async (req, res) => {
    try {
        // Adding Pagination
        const limitValue = req.query.limit || 2;
        const skipValue = req.query.skip || 0;
        const result = await Class.find().limit(limitValue).skip(skipValue);
        const rest = await Student.find().select({ student_email: 1 }).sort({ student_email: 1 })
        console.log(result)
        res.send(rest)
    } catch (err) {
        console.log(err)
    }
})

app.get("/getstudentdata", async (req, res) => {
    try {
        const class_name = req.query.class_name;
        const result = await Class.findOne({ class_name: class_name });
        console.log(result);
        res.json({ result })
    } catch (err) {
        console.log(err)
    }
})
// app.get('/thing/:name/:id',(req,res)=>{
//     res.send({name:req.params.name,id:req.params.id})
//     console.log(req.params.id,req.params.name)
// })

app.listen(9500, (error) => {
    console.log("application running on port no 4500")
})


//aggregation in two tables
// Class.aggregate([
//     {
//         '$lookup': {
//             'from': 'students',//other table name
//             'localField': '_id',//name of class table field
//             'foreignField': 'class_id',//name of student table field
//             'as': 'studentdetails'//for join data store i have use studentdetails variable
//         }
//     },
//     {
//         $unwind: "$studentdetails",
//       },
// ]).exec((err, result) => {
//     if (err) {
//         console.log("error", err)
//     }
//     if (result) {
//         res.send(result)
//         console.log(result);
//     }
// })