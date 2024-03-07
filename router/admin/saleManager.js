const router = require("express").Router();

const sale = require("../../controllers/Admin/sale.manager.controllers")
const auth = require("../../auth/auth")

router.post("/create",auth.admin,sale.create)
router.get("/getSaleLeaderAll",auth.admin,sale.getSaleLeaderAll)
router.get("/getSaleLeaderBY/:id",auth.admin,sale.getSaleLeaderBY)
router.put("/EditSaleLeader/:id",auth.admin,sale.EditSaleLeader)
router.delete("/deleteSaleLeader/:id",auth.admin,sale.deleteSaleLeader)
module.exports = router; 