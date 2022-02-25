import express from 'express';
const employee = require('../controllers/employee.controller');
const employeeRouter = express.Router();
employeeRouter.post('/employeeRegister',employee.createEmployees);

module.exports = employeeRouter;
