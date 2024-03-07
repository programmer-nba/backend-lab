const router = require("express").Router();

const employee = require("../../controllers/employee/employee.samples.controllers");
const auth = require("../../auth/auth")
//พนักงานเเผนกเก็บตัวอย่าง
router.get("/GetAllEmploeSamples",auth.all, employee.GetAllEmploeSamples);
router.put("/EditEmployeeSamples/:id",auth.all, employee.EditEmployeeSamples);//เเก้ไขข้อมูลพนักงาน
router.delete("/deleteSamplesByDepartment/:id",auth.all, employee.deleteSamplesByDepartment)
router.delete("/deleteSamplesBy/:id",auth.all, employee.deleteSamplesBy);

module.exports = router;
