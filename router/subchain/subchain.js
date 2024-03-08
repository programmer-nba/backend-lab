const router = require("express").Router();

const subchain = require("../../controllers/subchains/subchains.controllers");
const auth = require("../../auth/auth");


router.get("/",auth.all, subchain.getall);


module.exports = router;