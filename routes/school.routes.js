const express = require("express");
const classes = require("../controllers/school.controller");
const schoolRouter = express.Router();
schoolRouter.post("/addClass", classes.createClass);
schoolRouter.post("/addStudentsDetails", classes.createStudentDetails)
schoolRouter.get("/getStudentsInfo/:id", classes.getStudentsDetalils)
schoolRouter.put("/updateStudentsDetails/:id",classes.updateStudentDetails)

module.exports = schoolRouter;