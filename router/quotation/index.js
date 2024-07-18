const router = require("express").Router();

const quotation = require("../../controllers/sale/quotation.controllers");
const auth = require("../../auth/auth")

router.post("/CreateVat", auth.sale, quotation.Quotation);//สร้างใบเสนอราคา
router.post("/QuotationBy/:id", auth.sale, quotation.QuotationById);//สร้างใบเสนอราคาแบบไอดี
router.put("/UpdateVatBy/:id", auth.sale, quotation.edit);//แก้ไขใบเสนอราคา
router.put("/update-status/:id", auth.all, quotation.updateQuotationStatus);
router.delete("/deleteQtBy/:id", auth.all, quotation.deleteQtByid);
router.delete("/deleteAllQt", auth.admin, quotation.deleteAllQt);
router.get("/GetAllQuotation", auth.all, quotation.GetAllQuotation);
router.get("/GetSaleBy/:id", auth.all, quotation.GetSaleByIds);
module.exports = router;
