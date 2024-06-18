const router = require("express").Router();

const quotation = require("../../controllers/sale/quotation.controllers");
const auth = require("../../auth/auth")

router.post("/CreateVat", auth.sale, quotation.Quotation);//สร้างใบเสนอราคา
router.post("/QuotationBy/:id", auth.sale, quotation.QuotationById);//สร้างใบเสนอราคาแบบไอดี
router.put("/UpdateVatBy/:id", auth.sale, quotation.edit);//แก้ไขใบเสนอราคา
router.put("/update-status/:id", auth.sale, quotation.updateQuotationStatus);
router.delete("/deleteQtBy/:id", auth.sale, quotation.deleteQtByid);
router.delete("/deleteAllQt", auth.sale, quotation.deleteAllQt);
router.get("/GetAllQuotation", auth.sale, quotation.GetAllQuotation);
router.get("/GetSaleBy/:id", auth.sale, quotation.GetSaleByIds);
module.exports = router;
