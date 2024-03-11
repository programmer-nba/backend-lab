const mongoose = require("mongoose");
const Joi = require("joi");

const SignatureSchema = new mongoose.Schema({
  signature: {
    name: { type: String, required: false },
    tel: { type: String, required: false },
    position: { type: String, required: false },
    img: { type: String, required: false }
  },
});

const Signature = mongoose.model("Signature", SignatureSchema);

module.exports = { Signature };
