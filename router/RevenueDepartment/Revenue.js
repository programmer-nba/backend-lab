const router = require("express").Router();
const revenue = require("../../controllers/RevenueDepartment/revenue.controllers")


router.post("/login",revenue.login)

module.exports = router;
