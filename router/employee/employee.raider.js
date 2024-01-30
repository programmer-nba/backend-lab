const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employee.raider.contollers");

//พนักงานเเผนกไรเดอร์
router.get("/GetAllEmploeRaider", employee.GetAllEmploeRaider);

module.exports = router;
