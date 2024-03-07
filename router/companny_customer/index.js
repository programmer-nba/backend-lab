const router = require("express").Router();

const commanny = require("../../controllers/companny_customer/companny_customer.controllers");
const auth = require("../../auth/auth")


router.post("/create",auth.sale, commanny.create);
router.put("/EditCompanyCustomer/:id", auth.sale,commanny.EditCompanyCustomer);
router.delete("/deleteCompanyCustomer/:id",auth.sale, commanny.deleteCompanyCustomer);
router.delete("/deleteAllCompanyCustomer",auth.sale, commanny.deleteAllCompanyCustomer)
router.get("/getCompannyCustomeAllsr",auth.all, commanny.getCompannyCustomeAllsr)
router.get("/getCompanyCustomerBy/:id",auth.all, commanny.getCompanyCustomerById)

module.exports = router;
