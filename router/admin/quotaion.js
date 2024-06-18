const router = require("express").Router();

const admin = require("../../controllers/Admin/admin.cotrollers")
const quotation = require("../../controllers/Admin/quotation.controllers")
const auth = require("../../auth/auth")
router.put("/ApproveQuotation/:id",quotation.ApproveQuotation)//ยืนยันใบเสนอราคา
router.put("/RejectQuotation/:id",quotation.RejectQuotation)//ปฏิเสธใบเสนอราคา
router.get("/getQuotationAll",quotation.getQuotationAll)
router.get("/getQuotationBy/:id",quotation.getQuotationById)
router.delete("/deleteQT/:id",quotation.deleteQT)
module.exports = router; 