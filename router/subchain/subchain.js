const router = require("express").Router();
const subchain = require("../../controllers/subchain/subchain.controllers");
const auth = require("../../auth/auth");


router.get("/",auth.all, subchain.getall);

router.get("/:id",auth.all, subchain.getbyid);

router.post("/",auth.all, subchain.add);

//แผนกขวดจัดเตรียมสำเร็จ
router.put("/preparesuccess/:id",auth.bottle, subchain.preparesuccess);

module.exports = router;