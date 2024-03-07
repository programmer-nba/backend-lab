const router = require("express").Router();

const employee = require("../../controllers/employee/employee.controller");
const auth = require("../../auth/auth")

//สร้างพนักงานเเต่ละเเผนก
router.post("/create", auth.admin, employee.create);
router.put("/EditEmployee/:id", auth.all, employee.EditEmployee);
router.delete("/deleteEmployee/:id", auth.admin, employee.deleteEmployee);
router.get("/GetAllEmploee", auth.all, employee.GetAllEmploees);
router.get("/GetMemberBy/:id", auth.all, employee.GetEmployeeByIds);

module.exports = router;
