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

const EmployeeSchema = new mongoose.Schema({
  profile_image: { type: String, required: false },
  employee_number: { type: String, required: false },
  card_number: { type: String, required: false }, //บัตรประชาชน
  name: { type: String, required: false }, //ชื่อ
  tel: { type: String, required: false }, //เบอร์โทร
  username: { type: String, required: false },
  password: { type: String, required: false }, //รหัสผ่าน
  nick_name: String,
  email: String,
  location: String,
  address: {
    house_umber: { type: String, required: false }, //เลขที่บ้าน
    moo_number: { type: String, required: false }, //เลขที่ หมู่
    soi: { type: String, required: false }, //ซอย
    name_road: { type: String, required: false }, //ชื่อถนน
    tumbol: { type: String, required: false }, //ตำบล
    district: { type: String, required: false }, //อำเภท
    province : { type: String, required: false }, //จังหวัด
    zip_code: { type: String, required: false }, //รหัสไปรษณีย์
   }, //ที่อยู่
  employee_position: { type: String, required: false, default: "" }, //เเผนกหลักของพนักงาน
  employee_sub_department: { type: String, required: false, default: "" }, //เเผนกย่อยในเเผนกหลัก
  timmestamp: { type: Date, required: false, default: Date.now() },
  status: { type: Boolean, required: false, default: true },
});
EmployeeSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      row: "employee",
      code: this.employee_number,
      employee_position: this.employee_position,
      employee_sub_department: this.employee_sub_department,
    },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "4h",
    }
  );
  return token;
};

const Employee = mongoose.model("Employee", EmployeeSchema);

const validateEmployee = (data) => {
  const schema = Joi.object({
    //card_number: Joi.string().required().label("กรุณากรอกเลขบัตรประชาชน"),
    name: Joi.string().required().label("กรุณากรอกชื่อ"),
    tel: Joi.string().required().label("กรุณากรอกเบอร์โทร"),
    password: passwordComplexity(complexityOptions)
      .required()
      .label("ไม่มีข้อมูลรหัสผ่าน"),
    //address: Joi.string().required().label("กรุณากรอกที่อยู่"),
  });
  return schema.validateEmployee(data);
};

module.exports = { Employee, validateEmployee };
