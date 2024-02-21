const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const authAdmin = require("../../lib/auth-admin");
const employee = require("../../controllers/employee/employee.controller");

//สร้างพนักงานเเต่ละเเผนก
router.post("/create",authAdmin, employee.create);
router.put("/EditEmployee/:id",authAdmin, employee.EditEmployee);
router.delete("/deleteEmployee/:id",authAdmin, employee.deleteEmployee);
router.get("/GetAllEmploee",authAdmin, employee.GetAllEmploees);
router.get("/GetMemberBy/:id",authAdmin, employee.GetEmployeeByIds);

module.exports = router;
