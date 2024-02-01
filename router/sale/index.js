const router = require("express").Router();
// const express = require('express');
const authEmployee = require("../../lib/auth-employee");
const authSale = require("../../lib/auth-sale");
const employee = require("../../controllers/sale/sale.controllers");

router.post("/create", employee.create);
router.put("/EditSale/:id", authSale, employee.EditSale);
router.get("/GetSaleBy/:id", authSale, employee.GetSaleByIds);
router.delete("/deleteSale/:id", authSale, employee.deleteSale);
router.delete("/deleteAllSale", employee.deleteAllSale);
router.get("/GetAllSale", authSale, employee.GetAllSale);

//สร้าง qrcode
router.post("/GenQrcode/:id", employee.GenQrCode);

//ส่งเเจ้งเตือนผ่าน gmail
// router.post("/SendGmail",employee.SendGmail)
module.exports = router;
