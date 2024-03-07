const router = require("express").Router();
const formdetails = require("../../controllers/customrt/from.details.controllers");
const auth = require("../../auth/auth")

router.post("/create", auth.sale, formdetails.create);//ฟอร์มกรอกข้อมูลของลูกค้า
router.put("/EditCustomer/:id", auth.sale, formdetails.EditCustomer)//เเก้ไขข้อมุลลูกค้า
router.get("/GetAlldetails", auth.all, formdetails.GetAlldetails)
router.get("/GetdetailsBy/:id", auth.all, formdetails.GetdetailsByID)
router.delete("/deleteDetails/:id", auth.sale, formdetails.deleteDetails)
router.delete("/deleteAllDetails", auth.sale, formdetails.deleteAllDetails)
module.exports = router;
