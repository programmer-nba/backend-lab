const router = require("express").Router();
const authAdmin = require("../../lib/auth-admin")
const admin = require("../../controllers/Admin/admin.cotrollers")

//เพิ่มลบเเก้ไขข้อมูลเเอดมิน
router.post("/create",authAdmin,admin.create)
router.put("/EditAdmin/:id",authAdmin,admin.EditAdmin)
router.delete("/deleteAdmins/:id", authAdmin, admin.deleteAdmins);
router.get("/getAdminAll", authAdmin, admin.getAdminAll);
router.get("/getAdminBy/:id", authAdmin, admin.getAdminsById);
module.exports = router; 