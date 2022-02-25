"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employee = require('../controllers/employee.controller');
const employeeRouter = express_1.default.Router();
employeeRouter.post('/employeeRegister', employee.createEmployees);
module.exports = employeeRouter;
