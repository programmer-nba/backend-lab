const router = require("express").Router();

const commanny = require("../../controllers/companny_customer/companny_customer.controllers");
const auth = require("../../auth/auth")


router.post("/create",auth.all, commanny.create);
router.put("/EditCompanyCustomer/:id", auth.all,commanny.EditCompanyCustomer);
router.delete("/deleteCompanyCustomer/:id",auth.all, commanny.deleteCompanyCustomer);
router.delete("/deleteAllCompanyCustomer",auth.all, commanny.deleteAllCompanyCustomer)
router.get("/getCompannyCustomeAllsr",auth.all, commanny.getCompannyCustomeAllsr)
router.get("/getCompanyCustomerBy/:id",auth.all, commanny.getCompanyCustomerById)

module.exports = router;
