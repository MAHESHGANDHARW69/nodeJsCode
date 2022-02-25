import express from "express";
// import db from "./models";
const db =require('./models');
const employeeRouter = require('./routes/employee.routes');

const app = express();
app.use(express.json());
db.sequelize.sync();

app.use('/api/employees',employeeRouter)

const PORT  =  process.env.PORT || 4000;

app.listen(PORT,()=>{
    console.log(`connected successfullt on port no ${PORT}`)
});