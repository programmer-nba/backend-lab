const router = require("express").Router();

const item = require("../../controllers/item/analysis.item.controllers");
const auth = require("../../auth/auth")
//วิธีการวิเคราะห์
router.post("/create", auth.admin, item.createItem); //สร้างวิธีการวิเคราะห์
router.post("/creates", auth.admin, item.createItems); //สร้างวิธีการวิเคราะห์
router.put("/EditItem/:id", auth.admin, item.editItem); //เเก้ไขวิธีการวิเคราะห์
router.get("/GetAllItem", item.getItems);
router.get("/GetItem/:id", item.getItem);
router.delete("/deleteItemAnalysis/:id", auth.admin, item.deleteItem);
router.delete("/deleteAll", auth.admin, item.deleteItems);

module.exports = router;
