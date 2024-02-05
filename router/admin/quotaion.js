const router = require("express").Router();
const authAdmin = require("../../lib/auth-admin")
const admin = require("../../controllers/Admin/admin.cotrollers")
const quotation = require("../../controllers/Admin/quotation.controllers")

router.put("/ApproveQuotation/:id",authAdmin,quotation.ApproveQuotation)//ยืนยันใบเสนอราคา
router.put("/RejectQuotation/:id",authAdmin,quotation.RejectQuotation)//ปฏิเสธใบเสนอราคา
router.get("/getQuotationAll",authAdmin,quotation.getQuotationAll)
router.get("/getQuotationBy/:id",authAdmin,quotation.getQuotationById)
router.delete("/deleteQT/:id",authAdmin,quotation.deleteQT)
module.exports = router; 