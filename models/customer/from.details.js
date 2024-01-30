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
const FromDetailsSchema = new mongoose.Schema({
  profile_image: { type: String, required: false },//เก็บรูปภาพประจำตัวของลูกค้า
  sample_imgage: { type: String, required: false },//รูปภาพตัวอย่าง
  customer_number: { type: String, required: false },
  customer_prefix: { type: String, required: false }, //คำนำหน้า
  customer_name: { type: String, required: false },//ชื่อ
  customer_lastname: { type: String, required: true },
  customer_idcard: { type: String, required: true }, //รหัสบัตรประชาชน
  customer_birthday: { type: String, required: true }, //วันเกิด
  customer_email: { type: String, required: false },
  customer_phone: { type: String, required: true },
  customer_position: { type: String, required: true },
  customer_role: { type: String, required: false },
  customer_contact: {
    type: String,
    required: false,
    default: "เพิ่มข้อมูลติดต่อลูกค้า",
  }, //ที่ติดต่อลูกค้า
  status: { type: Array, required: false },
  customer_note: { type: String, default: "ไม่มี" }, //หมายเหตุ
});
FromDetailsSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, name: this.customer_name, row: "customer" },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "90d",
    }
  );
  return token;
};
const FromDetails = mongoose.model("FromDetails", FromDetailsSchema);
module.exports = { FromDetails };
