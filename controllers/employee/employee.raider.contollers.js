const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const { google } = require("googleapis");
const axios = require("axios");
const req = require("express/lib/request.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const QRCode = require("qrcode");
const path = require("path");
const {
  Employee,
  validateEmployee,
} = require("../../models/employee/employee.model");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const {
  uploadFileCreate,
  deleteFile,
} = require("../../funtions/uploadfilecreate");

exports.GetAllEmploeRaider = async (req, res) => {
  try {
    const employee = await Employee.find({
      employee_sub_department: "เเผนกจัดเก็บตัวอย่างไรเดอร์",
    });
    if (employee.length > 0) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานเเผนกจัดเก็บตัวอย่างไรเดอร์สำเร็จ",
        data: employee,
      });
    } else {
      return res.status(404).send({
        message: "ไม่พบข้อมูลพนักงานเเผนกจัดเก็บตัวอย่างไรเดอร์",
        status: false,
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
exports.EditEmployeeRaider = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      let profile_image = ""; // ตั้งตัวแปรรูป
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        }
        profile_image = reqFiles[0];
      }
      const id = req.params.id;
      if (!req.body.password) {
        const employee = await Employee.findByIdAndUpdate(id, {
          ...req.body,
          profile_image: profile_image,
          "address.moo_number": req.body.moo_number,
          "address.soi": req.body.soi,
          "address.name_road": req.body.name_road,
          "address.tumbol": req.body.tumbol,
          "address.district": req.body.district,
          "address.province": req.body.province,
          "address.zip_code": req.body.zip_code,
        });
        if (employee) {
          if (employee) {
            return res.status(200).send({
              message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว",
              status: true,
            });
          } else {
            return res.status(500).send({
              message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้",
              status: false,
            });
          }
        }
      } else {
        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const employee = await Employee.findByIdAndUpdate(id, {
          ...req.body,
          password: hashPassword,
        });
        if (employee) {
          return res
            .status(200)
            .send({ message: "แก้ไขผู้ใช้งานนี้เรียบร้อยเเล้ว", status: true });
        } else {
          return res
            .status(500)
            .send({ message: "ไม่สามารถเเก้ไขผู้ใช้งานนี้ได้", status: false });
        }
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
exports.deleteEmployeeRaider = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลพนักงานเเผนกเก็บตัวอย่าง" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูลพนักงานเเผนกเก็บตัวอย่างสำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.deleteRaiderByDepartment = async (req,res) =>{
  try {
    const id = req.params.id;
    const employee = await Employee.findById(id);
    if (!employee) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลพนักงานแผนกเก็บตัวอย่าง" });
    }
    if (employee.employee_sub_department !== "เเผนกไรเดอร์") {
      return res.status(400).send({
        status: false,
        message: "ไม่สามารถลบพนักงานที่ไม่ใช่แผนกเก็บตัวอย่างได้",
      });
    }
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลพนักงานแผนกเก็บตัวอย่าง" });
    }
    return res
      .status(200)
      .send({ status: true, message: "ลบข้อมูลพนักงานแผนกเก็บตัวอย่างสำเร็จ" });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
}