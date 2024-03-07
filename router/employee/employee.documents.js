const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employy.document.controllers");
const QRCode = require('qrcode');
const auth = require("../../auth/auth")

//ผนักงานเเผนกจัดส่งเอกสาร
router.get("/GetAllEmploeDocoment",auth.all, employee.GetAllEmploeDocoment);
router.put("/EditEmployeeDocoment/:id",auth.all, employee.EditEmployeeDocoment);//เเก้ไขข้อมูลพนักงาน
router.delete("/deleteDocomentByDepartment/:id", auth.all,employee.deleteDocomentByDepartment)
module.exports = router;
