const db = require('../models');
const bcrypt = require("bcrypt");

const Employee = db.employees;

exports.createEmployees = async (req: any, res: any) => {
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
            .then((data:any) => {
                res.status(201).json({ data: data, msg: "User Registered successfully!" })
            })
            .catch((err:any) => {
                res.status(500).send({
                    message:
                        err.message || "Internal Server Error,"
                });
            })
    } catch (err) {

    }
}