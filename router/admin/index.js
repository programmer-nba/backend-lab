const router = require("express").Router();
const admin = require("../../controllers/Admin/admin.cotrollers")
const auth = require("../../auth/auth")

//เพิ่มลบเเก้ไขข้อมูลเเอดมิน
router.post("/create",admin.create)
router.put("/EditAdmin/:id",auth.admin,admin.EditAdmin)
router.delete("/deleteAdmins/:id", auth.admin, admin.deleteAdmins);
router.get("/getAdminAll", auth.all, admin.getAdminAll);
router.get("/getAdminBy/:id", auth.all, admin.getAdminsById);
module.exports = router; 