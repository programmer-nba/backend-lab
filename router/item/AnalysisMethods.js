const router = require("express").Router();
const item = require("../../controllers/item/analysis.item.controllers")


//วิธีการวิเคราะห์
router.post("/create", item.create);
router.put("/EditItem/:id", item.EditItem)
router.get("/GetAllItem", item.GetAllIem)
router.get("/GetItem/:id", item.GetAllIemByid)
router.delete("/deleteItemAnalysis/:id", item.deleteItemAnalysis)

module.exports = router;
