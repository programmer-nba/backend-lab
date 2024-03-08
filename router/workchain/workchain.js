const router = require("express").Router();
const workchain = require("../../controllers/workchains/workchain.controllers");
const auth = require("../../auth/auth");


router.get("/",auth.all, workchain.getall);

router.get("/:id",auth.all, workchain.getbyid);

router.post("/",auth.all, workchain.add);

module.exports = router;