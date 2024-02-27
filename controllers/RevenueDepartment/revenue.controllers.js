const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const axios = require("axios");
const { google } = require("googleapis");
const req = require("express/lib/request.js");
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

exports.
Chack = async (req, res) => {
  try {
    let data = {
      taxNo: req.body.taxNo,
    };
    if (!data.taxNo) {
      return res.status(400).send({
        message: "กรุณาระบุ เลขประตัวผู้เสียภาษี",
        status: false,
      });
    }
    const config = {
      method: "post",
      url: `${process.env.API_REVENUE}`,
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    console.log(config);

    const response = await axios(config);
    if (response.status === 200) {
      console.log(response.data);
      return res.status(200).send(response.data);
    } else {
      console.log(response.statusText);
      return res.status(response.status).send({
        message: response.statusText,
        status: false,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: err.message });
  }
};
