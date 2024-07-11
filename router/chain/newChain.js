const router = require("express").Router();

const chain = require("../../controllers/chain/chain_controller");
const auth = require("../../auth/auth");

router.post("/chain-new", auth.all, chain.createChain);
router.put("/chain-new/:id", auth.all, chain.updateChain);
router.get("/chains-new", auth.all, chain.getChains);
router.get("/chain-new/:id", chain.getChain);
router.delete("/chain-new/:id", auth.all, chain.deleteChain);

module.exports = router;