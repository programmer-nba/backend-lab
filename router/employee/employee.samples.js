const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employee.samples.controllers");

//พนักงานเเผนกเก็บตัวอย่าง
router.get("/GetAllEmploeSamples", employee.GetAllEmploeSamples);

module.exports = router;
