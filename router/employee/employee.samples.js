const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employee.samples.controllers");

//พนักงานเเผนกเก็บตัวอย่าง
router.get("/GetAllEmploeSamples", employee.GetAllEmploeSamples);
router.put("/EditEmployeeSamples/:id", employee.EditEmployeeSamples);//เเก้ไขข้อมูลพนักงาน
router.delete("/deleteSamplesByDepartment/:id", employee.deleteSamplesByDepartment)
router.delete("/deleteSamplesBy/:id", employee.deleteSamplesBy);

module.exports = router;
