const router = require("express").Router();

const employee = require("../../controllers/employee/employee.check.controllers");
const auth = require("../../auth/auth")

//ผนักงานเเผนกตรวจสอบ
router.get("/GetAllEmploeCheck",auth.all, employee.GetAllEmploeCheck);
router.put("/EditEmployeeCheck/:id",auth.all,employee.EditEmployeeCheck)
router.delete("/deleteCheckByDepartment/:id",auth.all,employee.deleteCheckByDepartment)
router.delete("/deleteCheckBy/:id",auth.all,employee.deleteCheckBy)
module.exports = router;
