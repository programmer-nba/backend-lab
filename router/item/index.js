const router = require("express").Router();
const item = require("../../controllers/item/item.controllers")


//รายละเอียดโครงการ
router.post("/create", item.create);
router.put("/EditItem/:id", item.EditItem)


module.exports = router;
