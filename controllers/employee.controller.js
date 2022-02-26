"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeController = void 0;
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
class EmployeeController {
    constructor() {
        // save employee data in database by api
        this.createEmployees = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { first_name, last_name, email, gender, password } = req.body;
                const oldUser = yield Employee.findOne({ where: { email } });
                if (oldUser) {
                    return res.status(409).json({ msg: "User Already Exist. Please Login" });
                }
                const encryptedPassword = yield bcrypt.hash(password, 8);
                const employee = {
                    first_name: first_name,
                    last_name: last_name,
                    email: email,
                    gender: gender,
                    password: encryptedPassword
                };
                Employee.create(employee)
                    .then((data) => {
                    res.status(201).json({ data: data, msg: "User Registered successfully!" });
                })
                    .catch((err) => {
                    res.status(500).send({
                        message: err.message || "Internal Server Error,"
                    });
                });
            }
            catch (e) {
                res.send(e);
            }
        });
        //login employee
        this.loginEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield Employee.findOne({ where: { email } });
                const isMatch = yield bcrypt.compare(password, user.password);
                console.log('=============>', isMatch);
                let data = {
                    id: user.id,
                    email: user.email
                };
                const access_token = yield jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "8h" });
                if (isMatch) {
                    res.status(200).json({ email: user.email, password: user.password, access_token, msg: "User LoggedIn!" });
                    console.log("user logged in");
                }
                else {
                    res.status(404).json({ error: 'Invalid password Details' });
                }
            }
            catch (err) {
                res.status(400).json({ error: "Invalid login Details" });
            }
        });
        //change password api employee
        this.changePasswordEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                let token = req.headers.authorization;
                let onlyToken = token.split(' ')[1];
                var decoded = jwt.verify(onlyToken, process.env.JWT_SECRET);
                console.log(decoded);
                var userId = decoded.id;
                console.log(userId);
                const salt = yield bcrypt.genSalt(8);
                const password = yield bcrypt.hash(req.body.password, salt);
                const id = yield Employee.findOne({ where: { id: userId } }).then((user) => {
                    user.update({ password: password }).then((user) => {
                        res.status(200).json({ data: user, msg: "Changed password successfully" });
                    });
                });
            }
            catch (err) {
                res.status(404).send("Unauthorized access");
            }
        });
    }
}
exports.EmployeeController = EmployeeController;
