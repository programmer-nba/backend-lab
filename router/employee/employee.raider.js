const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee");
const employee = require("../../controllers/employee/employee.raider.contollers");

//พนักงานเเผนกไรเดอร์
router.get("/GetAllEmploeRaider", employee.GetAllEmploeRaider);
router.put("/EditEmployeeRaider/:id",employee.EditEmployeeRaider)

//ทดสอบสร้าง qr code
router.get("/testQRcode/:id",employee.GetqrCode)

module.exports = router;
