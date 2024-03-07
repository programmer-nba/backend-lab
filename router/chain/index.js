const router = require("express").Router();

const chain = require("../../controllers/Chain/chain.controller");
const auth = require("../../auth/auth")

router.get("/getChainAlls",auth.all, chain.getChainAlls);
router.get("/getChainBy/:id",auth.all, chain.getChainById);
router.put("/getChainByEmployee/:id/:subId", auth.all,chain.getChainByEmployee)
router.delete("/deleteChain/:id",auth.all, chain.deleteChain)
module.exports = router;
