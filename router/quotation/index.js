const router = require("express").Router();
const quotation = require("../../controllers/sale/quotation.controllers")


router.post("/CreateVat",quotation.Quotation)
router.delete("/deleteQtBy/:id",quotation.deleteQtByid)
router.delete("/deleteAllQt",quotation.deleteAllQt)
router.get("/GetAllQuotation",quotation.GetAllQuotation)
router.get("/GetSaleBy/:id",quotation.GetSaleByIds)
module.exports = router;
