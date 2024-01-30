const router = require("express").Router();
const authEmployee = require("../../lib/auth-employee")
const authSale = require("../../lib/auth-sale")
const employee = require("../../controllers/sale/sale.controllers")

router.post("/create",authSale,employee.create)
router.put("/EditSale/:id",authSale,employee.EditSale)
router.get("/GetSaleBy/:id",authSale,employee.GetSaleByIds)
router.delete("/deleteSale/:id",authSale,employee.deleteSale)
router.get("/GetAllSale",authSale,employee.GetAllSale)
module.exports = router; 