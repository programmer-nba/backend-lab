const router = require("express").Router();

const item = require("../../controllers/item/item.report.controllers");
const auth = require("../../auth/auth");
//สร้างวข้อมูล report
router.post("/create", auth.admin, item.create); //สร้างวข้อมูล report
router.put("/EditItem/:id", auth.admin, item.EditItem)
router.get("/GetAllIemAll", item.GetAllIem);
router.get("/GetAllIemBy/:id", item.GetAllIemByid);
router.delete("/deleteItem/:id", auth.admin, item.deleteItem)
module.exports = router;
