const router = require("express").Router();
const authAdmin = require("../../lib/auth-admin");
const item = require("../../controllers/item/analysis.item.controllers");

//วิธีการวิเคราะห์
router.post("/create", authAdmin, item.create); //สร้างวิธีการวิเคราะห์
router.put("/EditItem/:id", authAdmin, item.EditItem); //เเก้ไขวิธีการวิเคราะห์
router.get("/GetAllItem", authAdmin, item.GetAllIem);
router.get("/GetItem/:id", authAdmin, item.GetAllIemByid);
router.delete("/deleteItemAnalysis/:id", authAdmin, item.deleteItemAnalysis);
router.delete("/deleteAll", authAdmin, item.deleteAll); //ลบข้อมูลทั้งหมด ใช้สำหรับคนขี้เกียจลบ

module.exports = router;
