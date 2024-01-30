const router = require("express").Router();
const authSale = require("../../lib/auth-sale");
const formdetails = require("../../controllers/customrt/from.details.controllers");

router.post("/create", authSale, formdetails.create);//ฟอร์มกรอกข้อมูลของลูกค้า
router.get("/GetAlldetails", authSale, formdetails.GetAlldetails)
router.get("/GetdetailsBy/:id", authSale, formdetails.GetdetailsByID)
router.delete("/deleteDetails/:id", authSale, formdetails.deleteDetails)
router.delete("/deleteAllDetails", authSale, formdetails.deleteAllDetails)
module.exports = router;
