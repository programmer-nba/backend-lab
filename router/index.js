const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const authMe = require("../lib/authMe");
const { Admins, validateAdmin } = require("../models/Admin/admin.model");
const {
  Employee,
  validateEmployee,
} = require("../models/employee/employee.model");
const { Sale, validateSale } = require("../models/sale/sale.models");
const {
  SaleLeader,
  validateSaleLeader,
} = require("../models/sale/sale.Leader.models");
const authMember = require("../lib/auth-employee");

router.post("/login", async (req, res) => {
  try{
    const admin = await Admins.findOne({
      admin_username: req.body.username,
    });
    const sale = await Sale.findOne({
      sale_username: req.body.username,
    });

    const employee = await Employee.findOne({
      username: req.body.username,
    });

    let password  
    if(admin){
      password =  await bcrypt.compare(req.body.password,admin.admin_password);
      if(password)
      {
        const payload = {
          _id: admin?._id,
          username: admin?.admin_username,
          name: admin?.admin_name,
          row: "admin",
        }
        const token = jwt.sign(payload, process.env.JWTPRIVATEKEY, { expiresIn: "90d" });
        return res.status(200).send({
          status: true,
          token: token,
          message: "เข้าสู่ระบบสำเร็จ",
          result: payload,
          row: "admin",  
        });
        
      }else{
        return res.status(400).send({status:false,message:"รหัสผ่านไม่ถูกต้อง"});
      }
    }else if(sale){
      password = await bcrypt.compare(req.body.password,sale.sale_password);
      if(password)
      {
        const payload = {
          _id: sale?._id,
          username: sale?.sale_username,
          name: sale?.sale_name,
          row: "sale",
        }
        const token = jwt.sign(payload, process.env.JWTPRIVATEKEY, { expiresIn: "90d" });
        return res.status(200).send({
          status: true,
          token: token,
          message: "เข้าสู่ระบบสำเร็จ",
          result: payload,
          row: "sale",  
        });
      }else{
        return res.status(400).send({status:false,message:"รหัสผ่านไม่ถูกต้อง"});
      }
     
    }else if(employee){
      if(req.body.password === employee.password)
      {
        const payload = {
          _id: employee?._id,
          username: employee?.employee_username,
          name: employee?.name,
          row: employee?.employee_position,
        }
        const token = jwt.sign(payload, process.env.JWTPRIVATEKEY, { expiresIn: "90d" });
        return res.status(200).send({
          status: true,
          token: token,
          message: "เข้าสู่ระบบสำเร็จ",
          result: payload,
          row: "employee",  
        });
      }
      else{
        return res.status(400).send({status:false,message:"รหัสผ่านไม่ถูกต้อง"});
      }
    }else{
      return res.status(400).send({status:false,message:"ไม่พบผู้ใช้งานนี้ในระบบ"});
    }
  }catch(error){
    return res.status(500).send({error:error.message});

  }
});

router.get("/me", authMe, async (req, res) => {
    try{
      const { decoded } = req;
      return res.status(200).send({ status: true, result: decoded });
    }catch(error){
      return res.status(500).send({error:error.message});
    }
}); 

module.exports = router;
