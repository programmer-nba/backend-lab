const router = require("express").Router();
const item = require("../../controllers/item/item.controllers");

const auth = require("../../auth/auth")
//รายละเอียดโครงการ
router.post("/create", auth.admin, item.create); //สร้างรายละเอียดโครงการ
router.put("/EditItem/:id", auth.admin, item.EditItem); //เเก้ไขรายละเอียดโครงการ
router.get("/GetAllItem", auth.admin, item.GetAllIem);
router.get("/GetItem/:id", auth.admin, item.GetAllIemByid);
router.delete("/deleteItem/:id", auth.admin, item.deleteItem);
router.delete("/deleteAll", auth.admin, item.deleteAll); //ลบข้อมูลทั้งหมด ใช้สำหรับคนขี้เกียจลบ

module.exports = router;
