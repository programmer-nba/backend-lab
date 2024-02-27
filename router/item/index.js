const router = require("express").Router();
const item = require("../../controllers/item/item.controllers");
const authAdmin = require("../../lib/auth-admin");

//รายละเอียดโครงการ
router.post("/create", authAdmin, item.create); //สร้างรายละเอียดโครงการ
router.put("/EditItem/:id", authAdmin, item.EditItem); //เเก้ไขรายละเอียดโครงการ
router.get("/GetAllItem", authAdmin, item.GetAllIem);
router.get("/GetItem/:id", authAdmin, item.GetAllIemByid);
router.delete("/deleteItem/:id", authAdmin, item.deleteItem);
router.delete("/deleteAll", authAdmin, item.deleteAll); //ลบข้อมูลทั้งหมด ใช้สำหรับคนขี้เกียจลบ

module.exports = router;
