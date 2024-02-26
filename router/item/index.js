const router = require("express").Router();
const item = require("../../controllers/item/item.controllers")


//รายละเอียดโครงการ
router.post("/create", item.create);//สร้างรายละเอียดโครงการ
router.put("/EditItem/:id", item.EditItem)//เเก้ไขรายละเอียดโครงการ
router.get("/GetAllItem", item.GetAllIem)
router.get("/GetItem/:id", item.GetAllIemByid)
router.delete("/deleteItem/:id", item.deleteItem)
router.delete("/deleteAll", item.deleteAll);//ลบข้อมูลทั้งหมด ใช้สำหรับคนขี้เกียจลบ

module.exports = router;
