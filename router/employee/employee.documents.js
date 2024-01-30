const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employy.document.controllers");

//ผนักงานเเผนกจัดส่งเอกสาร
router.get("/GetAllEmploeDocoment", employee.GetAllEmploeDocoment);

module.exports = router;
