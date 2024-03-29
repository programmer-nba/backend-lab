const router = require("express").Router();

const item = require("../../controllers/item/analysis.item.controllers");
const auth = require("../../auth/auth")
//วิธีการวิเคราะห์
router.post("/create", auth.admin, item.create); //สร้างวิธีการวิเคราะห์
router.put("/EditItem/:id", auth.admin, item.EditItem); //เเก้ไขวิธีการวิเคราะห์
router.get("/GetAllItem", item.GetAllIem);
router.get("/GetItem/:id", item.GetAllIemByid);
router.delete("/deleteItemAnalysis/:id", auth.admin, item.deleteItemAnalysis);
router.delete("/deleteAll", auth.admin, item.deleteAll);

module.exports = router;
