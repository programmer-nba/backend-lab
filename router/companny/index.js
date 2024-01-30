const router = require("express").Router();
const commanny = require("../../controllers/companny/companny.contollers");
const authAdmin = require("../../lib/auth-admin")

router.post("/create", authAdmin, commanny.create);
router.put("/EditCompany/:id", authAdmin, commanny.EditCompany);
router.delete("/deleteCompany/:id", authAdmin, commanny.deleteCompany);
router.delete("/deleteAllCompany", authAdmin, commanny.deleteAllCompany);
router.get("/getCompannyAll", authAdmin, commanny.getCompannyAlls);
router.get("/getCompanyBy/:id", authAdmin, commanny.getCompanyById);
module.exports = router;
