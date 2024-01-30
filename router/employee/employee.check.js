const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employee.check.controllers");

//ผนักงานเเผนกตรวจสอบ
router.get("/GetAllEmploeCheck", employee.GetAllEmploeCheck);

module.exports = router;
