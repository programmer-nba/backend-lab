const router = require("express").Router();
const authSale = require("../../lib/auth-sale")
const commanny = require("../../controllers/companny_customer/companny_customer.controllers");

router.post("/create",authSale, commanny.create);
router.put("/EditCompanyCustomer/:id", authSale,commanny.EditCompanyCustomer);
router.delete("/deleteCompanyCustomer/:id",authSale, commanny.deleteCompanyCustomer);
router.delete("/deleteAllCompanyCustomer",authSale, commanny.deleteAllCompanyCustomer)
router.get("/getCompannyCustomeAllsr",authSale, commanny.getCompannyCustomeAllsr)
router.get("/getCompanyCustomerBy/:id",authSale, commanny.getCompanyCustomerById)

module.exports = router;
