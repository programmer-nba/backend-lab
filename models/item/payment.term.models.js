const mongoose = require("mongoose");
const Joi = require("joi");

const PaymentTermSchema = new mongoose.Schema({
  title: String,
  payment_term: [
    { type: String, required: false }, //รายละเอียดงาน
  ],
});

const PaymentTerm = mongoose.model("PaymentTerm", PaymentTermSchema);

module.exports = { PaymentTerm };
