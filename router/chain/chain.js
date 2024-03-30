const router = require("express").Router();

const chain = require("../../controllers/chain/chains.controllers");
const auth = require("../../auth/auth");

router.post("/main/create", auth.all, chain.createChain);
router.put("/main/:id", auth.all, chain.updateChainStatus);
router.get("/main/all", auth.all, chain.getChains);
router.delete("/main/:id", auth.all, chain.deleteChain);

router.post("/sub/create", auth.all, chain.createSubChain);
router.put("/sub/update-status/:id", auth.all, chain.updateSubChainStatus);
router.put("/sub/upload/:id", auth.all, chain.uploadPictureSubChain);
router.get("/sub/all", auth.all, chain.getSubChains);
router.get("/sub/:id", auth.all, chain.getSubChain);
router.get("/sub/all/:chain_id", auth.all, chain.getSubChainsByMain);
router.get("/sub/code/:code", auth.all, chain.getSubChainByMainCode);
router.post("/sub/scan/:id/:secret", auth.all, chain.scanToCollect);
router.delete("/sub/:id", auth.all, chain.deleteSubChain);

router.post("/sub-labparam/create", auth.all, chain.createLabParam);
router.post("/sub-labparam/creates", auth.all, chain.createLabParams);
router.put("/sub-labparam/update/:id", auth.all, chain.updateLabParam);
router.get("/sub-labparam/all", auth.all, chain.getLabParams);
router.get("/sub-labparam/:id", auth.all, chain.getLabParam);
router.get("/sub-labparam/all-bysubchain/:subChain_id", auth.all, chain.getLabParamsBySubChain);
router.delete("/sub-labparam/:id", auth.all, chain.deleteLabParam);
router.put("/sub-labparam/upload/:id", auth.all, chain.uploadPictureLabParam);

module.exports = router;