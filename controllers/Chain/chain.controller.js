const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const fs = require("fs");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const { Company } = require("../../models/companny/companny.models");
const { Chain } = require("../../models/Chain/chain.models");
const multer = require("multer");
const jwt = require("jsonwebtoken");
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

exports.getChainAlls = async (req, res) => {
  try {
    const companny = await Chain.find();
    if (!companny) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูล chain ในระบบ" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: companny });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.getChainById = async (req, res) => {
  try {
    const id = req.params.id;
    const companny = await Chain.findById(id);
    if (!companny) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูล chain ในระบบ" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: companny });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.getChainByEmployee = async (req, res) => {
  try {
    const id = req.params.id;
    const subId = req.params.subId;
    const name = req.body.name;

    const updatedChain = await Chain.findOneAndUpdate(
      {
        "detail.work_details.project_details.sub_detail._id": subId,
      },
      {
        $set: {
          "detail.$[].work_details.$[].project_details.$[].sub_detail.$[sub].status": {
            detail: "รับงานแล้ว",
            name: name,
          },
        },
      },
      {
        arrayFilters: [{ "sub._id": subId }],
        new: true,
      }
    );
    if (!updatedChain) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูล chain ในระบบ" });
    }

    return res.status(200).send({
      status: true,
      message: "อัปเดตข้อมูลสำเร็จ",
      data: updatedChain,
    });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }

};
exports.deleteChain = async (req, res) => {
  try {
    const id = req.params.id;
    const chain = await Quotation.findByIdAndDelete(id);
    if (!chain) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูล chain" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมุล chain สำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
