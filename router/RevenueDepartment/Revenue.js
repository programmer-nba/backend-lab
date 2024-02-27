const router = require("express").Router();
const revenue = require("../../controllers/RevenueDepartment/revenue.controllers")
const authSale = require("../../lib/auth-sale")


router.post("/Chack",authSale,revenue.Chack)


module.exports = router;
