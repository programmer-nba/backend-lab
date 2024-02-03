const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employy.document.controllers");
const QRCode = require('qrcode');

//ผนักงานเเผนกจัดส่งเอกสาร
router.get("/GetAllEmploeDocoment", employee.GetAllEmploeDocoment);
router.put("/EditEmployeeDocoment/:id", employee.EditEmployeeDocoment);
router.delete("/deleteDocomentByDepartment/:id", employee.deleteDocomentByDepartment)
module.exports = router;
