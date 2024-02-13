const router = require("express").Router();
const authAdmin = require("../../lib/auth-admin")
const chain = require("../../controllers/Chain/chain.controller")


router.get("/getChainAlls",authAdmin, chain.getChainAlls)

module.exports = router;
