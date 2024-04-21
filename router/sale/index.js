const router = require("express").Router();
const employee = require("../../controllers/sale/sale.controllers");
const auth = require("../../auth/auth");



router.post("/create",auth.all, employee.create);
router.put("/EditSale/:id", auth.all, employee.EditSale);
router.get("/GetSaleBy/:id", auth.all, employee.GetSaleByIds);
router.delete("/deleteSale/:id", auth.all, employee.deleteSale);
router.delete("/deleteAllSale", employee.deleteAllSale);
router.get("/GetAllSale", auth.all, employee.GetAllSale);

//สร้าง qrcode
router.post("/GenQrcode/:id", employee.GenQrCode);
router.get("/GetEmployee/:nuumber", employee.GetEmployee)

//ส่งเเจ้งเตือนผ่าน gmail
router.post("/SendGmail",employee.SendGmail)
router.post("/sendmail-nofile",employee.SendGmailNofile)
module.exports = router;
