const db = require('../models');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();

const Employee = db.employees;

// exports.createEmployees = async (req: any, res: any) => {
//     try {
//         const { first_name, last_name, email, gender, password } = req.body;
//         const oldUser = await Employee.findOne({ where: { email } });
//         if (oldUser) {
//             return res.status(409).json({ msg: "User Already Exist. Please Login" });
//         }
//         const encryptedPassword = await bcrypt.hash(password, 8);
//         const employee = {
//             first_name: first_name,
//             last_name: last_name,
//             email: email,
//             gender: gender,
//             password: encryptedPassword
//         }
//         Employee.create(employee)
//             .then((data:any) => {
//                 res.status(201).json({ data: data, msg: "User Registered successfully!" })
//             })
//             .catch((err:any) => {
//                 res.status(500).send({
//                     message:
//                         err.message || "Internal Server Error,"
//                 });
//             })
//     } catch (err) {

//     }
// }

export class EmployeeController {
    // save employee data in database by api
    createEmployees = async (req: any, res: any) => {
        try {
            const { first_name, last_name, email, gender, password } = req.body;
            const oldUser = await Employee.findOne({ where: { email } });
            if (oldUser) {
                return res.status(409).json({ msg: "User Already Exist. Please Login" });
            }
            const encryptedPassword = await bcrypt.hash(password, 8);
            const employee = {
                first_name: first_name,
                last_name: last_name,
                email: email,
                gender: gender,
                password: encryptedPassword
            }
            Employee.create(employee)
                .then((data: any) => {
                    res.status(201).json({ data: data, msg: "User Registered successfully!" })
                })
                .catch((err: any) => {
                    res.status(500).send({
                        message:
                            err.message || "Internal Server Error,"
                    });
                })
        } catch (e) {
            res.send(e)
        }
    }
    //login employee
    loginEmployee = async (req: any, res: any) => {
        try {
            const { email, password } = req.body;
            const user = await Employee.findOne({ where: { email } });
            const isMatch = await bcrypt.compare(password, user.password);
            console.log('=============>',isMatch)
            let data = {
                id: user.id,
                email: user.email
            }
            const access_token = await jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "8h" })
            if (isMatch) {
                res.status(200).json({ email: user.email, password: user.password, access_token, msg: "User LoggedIn!" });
                console.log("user logged in")                
            } else {
                res.status(404).json({ error: 'Invalid password Details' });
            }
        } catch (err) {
            res.status(400).json({ error: "Invalid login Details" })
        }
    }
    //change password api employee
    changePasswordEmployee = async (req: any, res: any) => {
        try {
            let token = req.headers.authorization;
            let onlyToken = token.split(' ')[1]
            var decoded = jwt.verify(onlyToken, process.env.JWT_SECRET);
            console.log(decoded)
            var userId = decoded.id
            console.log(userId)
            const salt = await bcrypt.genSalt(8);
            const password = await bcrypt.hash(req.body.password, salt);
            const id = await Employee.findOne({ where: { id: userId } }).then((user:any) => {
                user.update({ password: password }).then((user:any) => {
                    res.status(200).json({ data: user, msg: "Changed password successfully" })
                })
            });
        } catch (err) {
            res.status(404).send("Unauthorized access")
        }
    }
}