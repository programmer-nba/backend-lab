const router = require("express").Router();

const item = require("../../controllers/item/payment.term.controllers");
const auth = require("../../auth/auth");
//วิธีการชำระหรือเงือนไขต่างๆ
router.post("/create", auth.admin, item.create); //สร้างวิธีการชำระหรือเงือนไขต่างๆ
router.put("/EditItem/:id", auth.admin, item.EditItem);
router.get("/GetAllIem", item.GetAllIem);
router.get("/GetAllIemBy/:id", item.GetAllIemByid);
router.delete("/deleteItem/:id", auth.admin, item.deleteItem)
module.exports = router;
