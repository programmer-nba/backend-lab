const router = require("express").Router();

const admin = require("../../controllers/Admin/admin.cotrollers")
const quotation = require("../../controllers/Admin/quotation.controllers")
const auth = require("../../auth/auth")
router.put("/ApproveQuotation/:id",auth.admin,quotation.ApproveQuotation)//ยืนยันใบเสนอราคา
router.put("/RejectQuotation/:id",auth.admin,quotation.RejectQuotation)//ปฏิเสธใบเสนอราคา
router.get("/getQuotationAll",auth.admin,quotation.getQuotationAll)
router.get("/getQuotationBy/:id",auth.admin,quotation.getQuotationById)
router.delete("/deleteQT/:id",auth.admin,quotation.deleteQT)
module.exports = router; 