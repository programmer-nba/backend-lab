const router = require("express").Router();
const authAdmin = require("../../lib/auth-admin")
const sale = require("../../controllers/Admin/sale.manager.controllers")

router.post("/create",authAdmin,sale.create)
router.get("/getSaleLeaderAll",authAdmin,sale.getSaleLeaderAll)
router.get("/getSaleLeaderBY/:id",authAdmin,sale.getSaleLeaderBY)
router.put("/EditSaleLeader/:id",authAdmin,sale.EditSaleLeader)
module.exports = router; 