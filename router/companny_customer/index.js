const router = require("express").Router();
const commanny = require("../../controllers/companny_customer/companny_customer.controllers");

router.post("/create", commanny.create);
router.put("/EditCompanyCustomer/:id", commanny.EditCompanyCustomer);
router.delete("/deleteCompanyCustomer/:id", commanny.deleteCompanyCustomer);
router.delete("/deleteAllCompanyCustomer", commanny.deleteAllCompanyCustomer)
router.get("/getCompannyCustomeAllsr", commanny.getCompannyCustomeAllsr)
router.get("/getCompanyCustomerBy/:id", commanny.getCompanyCustomerById)

module.exports = router;
