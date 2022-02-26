"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const { EmployeeController } = require('../controllers/employee.controller');
const employeeRouter = express_1.default.Router();
const employee = new EmployeeController(); // create object of class 
employeeRouter.post('/employeeRegister', employee.createEmployees);
employeeRouter.post('/employeeLogin', employee.loginEmployee);
employeeRouter.post('/changePasswordEmployee', employee.changePasswordEmployee);
module.exports = employeeRouter;
