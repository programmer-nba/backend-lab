const router = require("express").Router();
const employee = require("../../controllers/employee/employee.bottle.controllers");
const auth = require("../../auth/auth")

//พนักงานเเผนกขวด
router.get("/GetAllEmploeBottle",auth.all, employee.GetAllEmploeBottle);
router.put("/EditEmployeeBottle/:id",auth.all,employee.EditEmployeeBottle)
router.delete("/deleteEmployee/:id",auth.all, employee.deleteEmployeeBottle)
router.delete("/delete/:id", auth.all,employee.deleteEmployeeBottleById)

module.exports = router;
