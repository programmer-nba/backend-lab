const router = require("express").Router();
const quotation = require("../../controllers/sale/base.quotation.controller");
const auth = require("../../auth/auth");

router.post("/create", auth.all, quotation.BaseQuotation);
router.get("/GetAllQuotation", auth.all, quotation.GetAllQuotation)
router.get("/GetBaseQuotationBy/:id", auth.all, quotation.GetBaseQuotationById)
router.put("/edit/:id", auth.all, quotation.edit)

module.exports = router;
