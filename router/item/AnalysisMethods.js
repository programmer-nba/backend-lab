const router = require("express").Router();
const item = require("../../controllers/item/analysis.item.controllers")


//วิธีการวิเคราะห์
router.post("/create", item.create);
router.put("/EditItem/:id", item.EditItem)


module.exports = router;
