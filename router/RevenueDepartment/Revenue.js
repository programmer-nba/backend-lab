const router = require("express").Router();
const revenue = require("../../controllers/RevenueDepartment/revenue.controllers")


router.post("/Chack",revenue.Chack)


module.exports = router;
