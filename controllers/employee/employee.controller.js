const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const { Admins, validateAdmin } = require("../../models/Admin/admin.model");
const { Sale, validateSale } = require("../../models/sale/sale.models");
const {
  Employee,
  validateEmployee,
} = require("../../models/employee/employee.model");
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    // console.log(file.originalname);
  },
});
const {
  uploadFileCreate,
  deleteFile,
} = require("../../funtions/uploadfilecreate");

exports.create = async (req, res) => {
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
          //   reqFiles.push(url + "/public/" + req.files[i].filename);
        }
        profile_image = reqFiles[0];
      }
      const user = await Employee.findOne({ username: req.body.username });
      if (user) {
        return res
          .status(409)
          .send({ status: false, message: "username นี้มีคนใช้แล้ว" });
      }
      const employee_number = await Employeenumber();
      //const salt = await bcrypt.genSalt(Number(process.env.SALT));
      //const hashPassword = await bcrypt.hash(req.body.password, salt);

      const employee = new Employee({
        employee_number: employee_number,
        profile_image: profile_image,
        email: req.body.email,
        employee_position: req.body.employee_position,
        employee_sub_department: req.body.employee_sub_department,
        name: req.body.name,
        nick_name: req.body.nick_name,
        tel: req.body.tel,
        username: req.body.username,
        password: req.body.password,
      });
      const add = await employee.save();
      return res.status(200).send({
        status: true,
        message: "คุณได้สร้างไอดี user เรียบร้อย",
        data: add,
      });
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
exports.EditEmployee = async (req, res) => {
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
        //const salt = await bcrypt.genSalt(Number(process.env.SALT));
        //const hashPassword = await bcrypt.hash(req.body.password, salt);
        const employee = await Employee.findByIdAndUpdate(id, {
          ...req.body,
          password: req.body.password,
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
exports.deleteEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลพนักงาน" });
    } else {
      return res.status(200).send({ status: true, message: "ลบข้อมูลพนักงาน" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.GetAllEmploees = async (req, res) => {
  try {
    const employees = await Employee.find();
    const sales = await Sale.find();

    if (!employees || !sales) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลพนักงาน" });
    } else {
      const combinedData = {
        status: true,
        message: "ดึงข้อมูลพนักงานสำเร็จ",


        
        employees: employees,
        sales: sales,
      };
      return res.status(200).send(combinedData);
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.GetEmployeeByIds = async (req, res) => {
  try {
    const id = req.params.id;
    const employee = await Employee.findById(id);
    if (employee) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานสำเร็จ",
        data: employee,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูลสมาชิก", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};


async function Employeenumber(date) {
  const emp = await Employee.find();
  let employee_number = null;
  if (emp.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `EMP${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      check = await Employee.find({ employee_number: data });
      if (check.length === 0) {
        employee_number =
          `EMP${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    employee_number =
      `EMP${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
  }
  return employee_number;
}
