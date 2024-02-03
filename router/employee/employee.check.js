const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employee.check.controllers");

//ผนักงานเเผนกตรวจสอบ
router.get("/GetAllEmploeCheck", employee.GetAllEmploeCheck);
router.put("/EditEmployeeCheck/:id",employee.EditEmployeeCheck)
router.delete("/deleteCheckByDepartment/:id",employee.deleteCheckByDepartment)
router.delete("/deleteCheckBy/:id",employee.deleteCheckBy)
module.exports = router;
