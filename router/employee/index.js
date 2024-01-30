const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employee.controller");

//สร้างพนักงานเเต่ละเเผนก
router.post("/create", employee.create);
router.put("/EditEmployee/:id", employee.EditEmployee);
router.delete("/deleteEmployee/:id", employee.deleteEmployee);
router.get("/GetAllEmploee", employee.GetAllEmploees);
router.get("/GetMemberBy/:id", employee.GetEmployeeByIds);

module.exports = router;
