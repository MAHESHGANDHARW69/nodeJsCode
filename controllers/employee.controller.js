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
const db = require('../models');
const bcrypt = require("bcrypt");
const Employee = db.employees;
exports.createEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    catch (err) {
    }
});
