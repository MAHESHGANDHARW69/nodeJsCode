import express from 'express';
const { EmployeeController } = require('../controllers/employee.controller');
const employeeRouter = express.Router();
const employee = new EmployeeController(); // create object of class 
employeeRouter.post('/employeeRegister', employee.createEmployees);
employeeRouter.post('/employeeLogin', employee.loginEmployee);
employeeRouter.post('/changePasswordEmployee', employee.changePasswordEmployee);
employeeRouter.put('/updateProfile',employee.updateProfileEmployee)

module.exports = employeeRouter;
