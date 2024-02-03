const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employee.bottle.controllers");

//พนักงานเเผนกขวด
router.get("/GetAllEmploeBottle", employee.GetAllEmploeBottle);
router.put("/EditEmployeeBottle/:id",employee.EditEmployeeBottle)
router.delete("/deleteEmployee/:id", employee.deleteEmployeeBottle)
router.delete("/delete/:id", employee.deleteEmployeeBottleById)

module.exports = router;
