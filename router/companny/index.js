const router = require("express").Router();
const commanny = require("../../controllers/companny/companny.contollers");

const auth = require("../../auth/auth")
router.post("/create", auth.admin, commanny.create);
router.put("/EditCompany/:id", auth.admin, commanny.EditCompany);
router.delete("/deleteCompany/:id", auth.admin, commanny.deleteCompany);
router.delete("/deleteAllCompany", auth.admin, commanny.deleteAllCompany);
router.get("/getCompannyAll", auth.all, commanny.getCompannyAlls);
router.get("/getCompanyBy/:id", auth.all, commanny.getCompanyById);
module.exports = router;
