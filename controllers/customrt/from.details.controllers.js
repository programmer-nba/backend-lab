const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const multer = require("multer");
const jwt = require("jsonwebtoken");
console;
const { FromDetails } = require("../../models/customer/from.details");
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
      if (err) {
        return res
          .status(403)
          .send({ message: "มีบางอย่างผิดพลาด", data: err });
      }
      const reqFiles = [];
      if (!req.files) {
        res.status(500).send({
          message: "มีบางอย่างผิดพลาด",
          data: "No Request Files",
          status: false,
        });
      } else {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          await uploadFileCreate(req.files, res, { i, reqFiles });
        }
        const customer_number = await customernumber();
        const data = {
          sample_imgage: reqFiles[0],
          customer_number: customer_number,
          customer_prefix: req.body.customer_prefix,
          customer_name: req.body.customer_name,
          customer_lastname: req.body.customer_lastname,
          customer_idcard: req.body.customer_idcard,
          customer_birthday: req.body.customer_birthday,
          customer_email: req.body.customer_email,
          customer_phone: req.body.customer_phone,
          customer_contact: req.body.customer_contact,
          customer_note: req.body.customer_note,
          district: req.body.district,
          amphur: req.body.amphur,
          province: req.body.province,
          postagecode: req.body.postagecode,
        };
        const details = await FromDetails.create(data);
        if (details) {
          return res
            .status(200)
            .send({ status: true, message: "บันทึกสำเร็จ", data: details });
        } else {
          return res
            .status(403)
            .send({ status: false, message: "ไม่สามารถบันทึกได้" });
        }
      }
    });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.EditCustomer = async (req, res) => {
  try {
    let upload = multer({ storage: storage }).array("imgCollection", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        }
      }
      const id = req.params.id;
      if (id && !req.body.password) {
        const customer = await FromDetails.findByIdAndUpdate(id, {
          ...req.body,
          profile_image: reqFiles[0],
        });
        if (customer) {
          return res.status(200).send({
            message: "เพิ่มรูปภาพสำเร็จ",
            status: true,
          });
        } else {
          return res.status(500).send({
            message: "ไม่สามารถเพิ่มรูปภาพได้",
            status: false,
          });
        }
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, error: error.message });
  }
};
exports.GetAlldetails = async (req, res) => {
  try {
    const details = await FromDetails.find();
    if (details.length > 0) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลใบงานสำเร็จ",
        data: details,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูลใบงาน", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
exports.GetdetailsByID = async (req, res) => {
  try {
    const id = req.params.id;
    const details = await FromDetails.findById(id);
    if (details) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลใยงานสำเร็จ",
        data: details,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูลใยงาน", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
exports.deleteDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const details = await FromDetails.findByIdAndDelete(id);
    if (!details) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลใบงาน" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูลใบงานสำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.deleteAllDetails = async (req, res) => {
  try {
    const details = await FromDetails.deleteMany();
    if (!details) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลใบงาน" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูลใบงานทั้งหมดสำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};

async function customernumber(date) {
  const customer = await FromDetails.find();
  let customer_number = null;
  if (customer.length !== 0) {
    let data = "";
    let num = 0;
    let check = null;
    do {
      num = num + 1;
      data = `DT${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      check = await FromDetails.find({ customer_number: data });
      if (check.length === 0) {
        customer_number =
          `DT${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
      }
    } while (check.length !== 0);
  } else {
    customer_number =
      `DT${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
  }
  return customer_number;
}
