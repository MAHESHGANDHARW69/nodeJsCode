"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import db from "./models";
const db = require('./models');
const employeeRouter = require('./routes/employee.routes');
const app = (0, express_1.default)();
app.use(express_1.default.json());
db.sequelize.sync();
app.use('/api/employees', employeeRouter);
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`connected successfullt on port no ${PORT}`);
});
