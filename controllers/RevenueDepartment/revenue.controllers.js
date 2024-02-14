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

exports.login = async (req, res) => {
  try {
    const { username, password, nonce } = req.body;

    if (!username || !password || !nonce) {
      return res.status(400).send({
        message: "กรุณาระบุ username, password, และ nonce",
        status: false,
      });
    }
    const config = {
      method: "post",
      url: `${process.env.API_REVENUE}`,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: new URLSearchParams({
        username,
        password,
        nonce,
      }).toString(),
    };
    console.log(config);
    await axios(config)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "มีบางอย่างผิดพลาด" });
  }
};
