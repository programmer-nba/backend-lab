const router = require("express").Router();
const item = require("../../controllers/item/item.controllers")


//รายละเอียดโครงการ
router.post("/create", item.create);
router.put("/EditItem/:id", item.EditItem)
router.get("/GetAllItem", item.GetAllIem)
router.get("/GetItem/:id", item.GetAllIemByid)
router.delete("/deleteItem/:id", item.deleteItem)


module.exports = router;
