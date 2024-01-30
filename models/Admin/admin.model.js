const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const complexityOptions = {
  min: 6,
  max: 30,
  lowerCase: 0,
  upperCase: 0,
  numeric: 0,
  symbol: 0,
  requirementCount: 2,
};

const AdminSchema = new mongoose.Schema({
  adminnumber: { type: String, required: false }, //หรัสประจำตัว
  profile_image: { type: String, required: false }, //รูปภาพ
  card_number: { type: Number, required: false }, //บัตรประชาชน
  admin_name: { type: String, required: false }, //ชื่อ
  admin_tel: { type: String, required: false }, //เบอร์โทร
  admin_username: { type: String, required: false }, //เลขบัตร
  admin_password: { type: String, required: false }, //รหัส
  admin_email: { type: String, required: false },
  admin_position: { type: String, required: false },
});

AdminSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.admin_name, row: "admin" },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "90d",
    }
  );
  return token;
};

const Admins = mongoose.model("admin", AdminSchema);

const validateAdmin = (data) => {
  const schema = Joi.object({
    admin_name: Joi.string().required().label("กรุณากรอกชื่อผู้ใช้ด้วย"),
    admin_username: Joi.string().required().label("กรุณากรอก ไอดี ผู้ใช้ด้วย"),
    card_number: Joi.string().required().label("กรุณากรอกเลขบัตรผู้ใช้ด้วย"),
    admin_tel: Joi.string().required().label("กรุณากรอกเบอร์โทรผู้ใช้ด้วย"),
    admin_password: passwordComplexity(complexityOptions)
      .required()
      .label("admin_password"),
    admin_position: Joi.string().required().label("กรุณากรอกเลเวลผู้ใช้ด้วย"),
    admin_email: Joi.string().required().label("กรุณากรอกอีเมล์ผู้ใช้ด้วย"),
  });
  return schema.validate(data);
};

module.exports = { Admins, validateAdmin };
