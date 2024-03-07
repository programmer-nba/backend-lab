const router = require("express").Router();
const revenue = require("../../controllers/RevenueDepartment/revenue.controllers")

const auth = require("../../auth/auth")

router.post("/Chack",auth.sale,revenue.Chack)


module.exports = router;
