const router = require("express").Router();
const item = require("../../controllers/item/analysis.item.controllers");

//วิธีการวิเคราะห์
router.post("/create", item.create);//สร้างวิธีการวิเคราะห์
router.put("/EditItem/:id", item.EditItem);//เเก้ไขวิธีการวิเคราะห์
router.get("/GetAllItem", item.GetAllIem);
router.get("/GetItem/:id", item.GetAllIemByid);
router.delete("/deleteItemAnalysis/:id", item.deleteItemAnalysis);
router.delete("/deleteAll", item.deleteAll);//ลบข้อมูลทั้งหมด ใช้สำหรับคนขี้เกียจลบ

module.exports = router;
