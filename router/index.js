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
  try {
    const admin = await Admins.findOne({
      admin_username: req.body.username,
    });
    if (!admin) return await checkEmployee(req, res);
    const validateAdmin = await bcrypt.compare(
      req.body.password,
      admin.admin_password
    );
    if (!validateAdmin) {
      return res.status(401).send({
        status: false,
        message: "รหัสผ่านไม่ถูกต้อง",
      });
    }
    const token = admin.generateAuthToken();
    console.log(token);
    const responseData = {
      id: admin.adminnumber,
      name: admin.admin_name,
      admin_tel: admin.admin_tel,
    };
    return res.status(200).send({
      status: true,
      token: token,
      message: "เข้าสู่ระบบสำเร็จ",
      result: responseData,
      level: "admin",
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .send({ status: false, message: "Internal Server Error" });
  }
});

router.get("/me", authMe, async (req, res) => {
  try {
    const { decoded } = req;
    if (decoded && decoded.row === "admin") {
      const id = decoded._id;
      const admin = await Admins.findOne({ _id: id });
      if (!admin) {
        return res
          .status(400)
          .send({ message: "มีบางอย่างผิดพลาด", status: false });
      } else {
        return res.status(200).send({
          name: admin.admin_name,
          username: admin.admin_username,
          position: "admin",
          level: admin.admin_position,
        });
      }
    }
    if (decoded && decoded.row === "employee") {
      const id = decoded._id;
      const employee = await Employee.findOne({ _id: id });
      if (!employee) {
        return res
          .status(400)
          .send({ message: "มีบางอย่างผิดพลาด", status: false });
      } else {
        return res.status(200).send({
          name: employee.name,
          username: employee.username,
          position: "employee",
          level: employee.employee_position,
          department: employee.employee_sub_department,
        });
      }
      employee;
    }
    if (decoded && decoded.row === "sale") {
      const id = decoded._id;
      const sale = await Sale.findOne({ _id: id });
      if (!sale) {
        return res
          .status(400)
          .send({ message: "มีบางอย่างผิดพลาด", status: false });
      } else {
        return res.status(200).send({
          name: sale.sale_name,
          username: sale.sale_username,
          position: "sale",
          level: sale.sale__position,
        });
      }
      sale;
    }
    if (decoded && decoded.row === "saleLeader") {
      const id = decoded._id;
      const sale = await SaleLeader.findOne({ _id: id });
      if (!sale) {
        return res
          .status(400)
          .send({ message: "มีบางอย่างผิดพลาด", status: false });
      } else {
        return res.status(200).send({
          name: sale.sale_name,
          username: sale.sale_username,
          position: "sale Leader",
          level: sale.sale__position,
        });
      }
      sale;
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", status: false });
  }
});

const checkEmployee = async (req, res) => {
  try {
    const emp = await Employee.findOne({
      username: req.body.username,
    });
    if (!emp) {
      return await checkSale(req, res);
    } else {
      const validatemember = await bcrypt.compare(
        req.body.password,
        emp.password
      );
      if (!validatemember) {
        // รหัสไม่ตรง
        return res.status(401).send({
          message: "password is not find",
          status: false,
        });
      } else {
        const token = emp.generateAuthToken();
        const ResponesData = {
          name: emp.name,
          username: emp.username,
          employee_position: emp.employee_position,
          employee_sub_department: emp.employee_sub_department,
        };
        return res.status(200).send({
          status: true,
          token: token,
          message: "เข้าสู่ระบบสำเร็จ",
          result: ResponesData,
          level: "employee",
        });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", status: false });
  }
};
const checkSale = async (req, res) => {
  try {
    const sale = await Sale.findOne({
      sale_username: req.body.username,
    });
    if (!sale) return await checkSaleLeader(req, res);
    const validPasswordSale = await bcrypt.compare(
      req.body.password,
      sale.sale_password
    );
    if (!validPasswordSale) {
      // รหัสไม่ตรง
      return res.status(401).send({
        message: "password is not find",
        status: false,
      });
    } else {
      const token = sale.generateAuthToken();
      const ResponesData = {
        name: sale.sale_username,
        username: sale.sale_password,
      };
      return res.status(200).send({
        status: true,
        token: token,
        message: "เข้าสู่ระบบสำเร็จ",
        result: ResponesData,
        level: "sale",
        position: sale.sale_position,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message, status: false });
  }
};
const checkSaleLeader = async (req, res) => {
  try {
    const sale = await SaleLeader.findOne({
      sale_username: req.body.username,
    });
    // if (!sale) return await checkAccountant(req, res);
    const validPasswordSaleLeader = await bcrypt.compare(
      req.body.password,
      sale.sale_password
    );
    if (!validPasswordSaleLeader) {
      // รหัสไม่ตรง
      return res.status(401).send({
        message: "password is not find",
        status: false,
      });
    } else {
      const token = sale.generateAuthToken();
      const ResponesData = {
        name: sale.sale_username,
        username: sale.sale_password,
      };
      return res.status(200).send({
        status: true,
        token: token,
        message: "เข้าสู่ระบบสำเร็จ",
        result: ResponesData,
        level: "sale Leader",
        position: sale.sale_position,
      });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message, status: false });
  }
};

module.exports = router;
