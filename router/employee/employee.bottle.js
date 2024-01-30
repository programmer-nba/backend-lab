const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employee.bottle.controllers");

//พนักงานเเผนกขวด
router.get("/GetAllEmploeBottle", employee.GetAllEmploeBottle);

module.exports = router;
