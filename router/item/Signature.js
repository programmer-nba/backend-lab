const router = require("express").Router();

const item = require("../../controllers/item/signature.controllers");
const auth = require("../../auth/auth");

router.post("/create", auth.admin, item.create); 
router.put("/EditItem/:id", auth.admin, item.EditItem);
router.get("/GetAllIem", auth.admin, item.GetAllIem);
router.get("/GetAllIemBy/:id", auth.admin, item.GetAllIemByid);
router.delete("/deleteItem/:id", auth.admin, item.deleteItem)
module.exports = router;
