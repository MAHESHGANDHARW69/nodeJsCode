const db = require("../models");
// const bcrypt = require("bcrypt");
// require("dotenv").config()
// const jwt = require("jsonwebtoken");
const Class = db.classes;
const Student = db.students;
// const Op = db.Sequelize.Op;
// const sequelize = require("sequelize");


exports.createClass = async (req, res) => {
    try {
        const { class_name, num_of_student, section } = req.body;
        const isclass = await Class.findOne({ where: { class_name } })
        if (isclass) {
            return res.status(409).json({ msg: "Class Already Exist" });
        }
        if (!(class_name && num_of_student)) {
            res.send("All is required fields!")
        } else {
            const classes = {
                class_name: class_name,
                num_of_student: num_of_student,
                section: section
            }
            Class.create(classes)
                .then(data => {
                    res.status(201).json({ data: data, msg: "Class added successfully" })
                })
                .catch(err => {
                    res.status(500).send({
                        message:
                            err.message || "Internal Server Error,"
                    });
                })
        }
    } catch (err) {
        res.send(err);
    }

}
exports.createStudentDetails = async (req, res) => {
    try {
        const { student_name, class_id, student_email, gender, address } = req.body;
        if (!(student_name && student_email && gender && address)) {
            res.status(400).send("All input is required");
        }
        // else {
        const existEmail = await Student.findOne({ where: { student_email } });
        if (existEmail) {
            return res.status(409).json({ msg: "Email Already Exist." });
        }
        const students = {
            student_name: student_name,
            class_id: class_id,
            student_email: student_email,
            gender: gender,
            address: address,
        }
        Student.create(students)
            .then(data => {
                res.status(201).json({ data: data, msg: "Data saved successfully" })
            })
            .catch(err => {
                res.status(500).send({
                    message:
                        err.message || "Internal Server Error,"
                });
            })
        // }
    } catch (err) {
        res.send("error");
    }
}
exports.getStudentsDetalils = async (req, res) => {
    try {

        // const result = await db.sequelize.query('SELECT * FROM students JOIN classes ON students.class_id=classes.id');
        // res.status(200).json(result)
        // const result = await Student.findAll({include:[{model:Class,required:true}]});
        // res.send(result)
        // const result = await Student.findOne({id:req.params.id});
        // console.log(result)
        // res.send(result)
        const result = await Student.findByPk(req.params.id)
        // const result = await db.sequelize.query(`SELECT * FROM students WHERE id=${req.params.id}`);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).send(err)
    }
}
//note email can not update,email is unique
exports.updateStudentDetails = async (req, res) => {
    try {
        const { student_name, class_id, student_email, gender, address } = req.body;
        let student = await Student.findByPk(req.params.id);
        student.update({
            student_name: student_name,
            class_id: class_id,
            // student_email: student_email,
            gender: gender,
            address: address,
        }).then((user) => {
            res.status(200).json({ data: user, msg: "Profile Updated successfully" })
        })
    } catch (err) {
        res.send(err)
    }
}
// exports.loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await User.findOne({ where: { email } });
//         const isMatch = await bcrypt.compare(password, user.password);
//         console.log('////////////////', isMatch)
//         let data = {
//             id: user.id,
//             email: user.email
//         }
//         const token = await jwt.sign(data, "mynameismaheshnodejsdevloper");
//         console.log(token)
//         if (isMatch) {
//             res.status(200).json({ email: user.email, password: user.password, auth_token: token, msg: "User LoggedIn!" });
//         } else {
//             res.status(404).json({ error: 'Invalid password Details' });
//         }
//     } catch (err) {
//         res.status(400).json({ error: "Invalid login Details" })
//     }
// }

// exports.changePasswordUser = async (req, res) => {
//     try {
//         let token = req.headers.authorization;
//         let onlyToken = token.split(' ')[1]
//         var decoded = jwt.verify(onlyToken, "mynameismaheshnodejsdevloper");
//         var userId = decoded.id
//         const salt = await bcrypt.genSalt(8);
//         const password = await bcrypt.hash(req.body.password, salt);
//         const id = await User.findOne({ where: { id: userId } }).then((user) => {
//             user.update({ password: password }).then((user) => {
//                 res.status(200).json({ data: user, msg: "Changed password successfully" })
//             })
//         });
//     } catch (err) {
//         res.status(404).send("Invalid token")
//     }
// }

// exports.getUserInfo = async (req, res) => {
//     try {
//         let user = await User.findAll();
//         res.status(200).json({ data: user });
//     } catch (err) {
//         res.status(400).send(err);
//     }
// }

// exports.updateProfileUsers = async (req, res) => {
//     try {
//         const { first_name, last_name, email, gender, password } = req.body;
//         let token = req.headers.authorization;
//         let onlyToken = token.split(' ')[1]
//         var decoded = jwt.verify(onlyToken, "mynameismaheshnodejsdevloper");
//         var userId = decoded.id
//         const encryptedPassword = await bcrypt.hash(password, 8);
//         let user = await User.findOne({ where: { id: userId } }).then((user) => {
//             user.update({
//                 first_name: first_name,
//                 last_name: last_name,
//                 email: email,
//                 gender: gender,
//                 password: encryptedPassword
//             }).then((user) => {
//                 res.status(200).json({ data: user, msg: "Profile Updated successfully" })
//             })
//         })
//     } catch (err) {
//         res.status(404).send("Invalid token")
//     }
// }

// exports.deleteUserDetails = async (req, res) => {
//     try {
//         let token = req.headers.authorization;
//         let onlyToken = token.split(' ')[1]
//         var decoded = jwt.verify(onlyToken, "mynameismaheshnodejsdevloper");
//         var userId = decoded.id
//         let user = await User.destroy({ where: { id: userId } }).then((user) => {
//             if (user) {
//                 res.json({ msg: "User was delete successfully!" })
//             } else {
//                 res.send({
//                     message: `Cannot delete with id=${id}`,
//                 });
//             }
//         })
//     } catch (err) {
//         res.status(404).send('Invalid token');
//     }
// }