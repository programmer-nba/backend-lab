const router = require("express").Router();

const chain = require("../../controllers/chain/chains.controllers");
const auth = require("../../auth/auth");


router.get("/",auth.all, chain.getall);


module.exports = router;