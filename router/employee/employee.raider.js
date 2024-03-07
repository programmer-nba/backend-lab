const router = require("express").Router();
const employee = require("../../controllers/employee/employee.raider.contollers");
const auth = require("../../auth/auth")
//พนักงานเเผนกไรเดอร์
router.get("/GetAllEmploeRaider",auth.all ,employee.GetAllEmploeRaider);
router.put("/EditEmployeeRaider/:id",auth.all,employee.EditEmployeeRaider)//เเก้ไขข้อมูลพนักงาน
router.delete("/deleteEmployeeRaider/:id", auth.all,employee.deleteEmployeeRaider);
router.delete("/deleteRaiderByDepartment/:id",auth.all, employee.deleteRaiderByDepartment)


module.exports = router;



