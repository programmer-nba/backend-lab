const router = require("express").Router();
const authSale = require("../../lib/auth-sale");
const quotation = require("../../controllers/sale/quotation.controllers");

router.post("/CreateVat", authSale, quotation.Quotation);//สร้างใบเสนอราคา
router.delete("/deleteQtBy/:id", authSale, quotation.deleteQtByid);
router.delete("/deleteAllQt", authSale, quotation.deleteAllQt);
router.get("/GetAllQuotation", authSale, quotation.GetAllQuotation);
router.get("/GetSaleBy/:id", authSale, quotation.GetSaleByIds);
module.exports = router;
