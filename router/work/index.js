const router = require("express").Router();

const work = require("../../controllers/work/work.controller");
const auth = require("../../auth/auth")

router.get("/getChainAlls",auth.all, work.getWorkAlls);
router.get("/getChainBy/:id",auth.all, work.getWorkById);

router.delete("/deleteChain/:id",auth.all, work.deleteWork)
module.exports = router;
