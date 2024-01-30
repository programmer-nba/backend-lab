const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
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

exports.GetAllEmploeDocoment = async (req, res) => {
  try {
    const employee = await Employee.find({
      employee_sub_department: "เเผนกจัดส่งเอกสาร",
    });
    if (employee.length > 0) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลพนักงานเเผนกขวดสำเร็จ",
        data: employee,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูลพนักงานเเผนกขวด", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
