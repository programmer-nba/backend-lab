const router = require("express").Router();
const authAdmin = require("../../lib/auth-admin");
const authEmployee = require("../../lib/auth-employee");
const chain = require("../../controllers/Chain/chain.controller");

router.get("/getChainAlls", chain.getChainAlls);
router.get("/getChainBy/:id", chain.getChainById);
router.put("/getChainByEmployee/:id/:subId", chain.getChainByEmployee)
router.delete("/deleteChain/:id", chain.deleteChain)
module.exports = router;
