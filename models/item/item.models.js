const mongoose = require("mongoose");
const Joi = require("joi");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: false }, //รายละเอียดงาน
});

const Item = mongoose.model("Item", itemSchema);

module.exports = { Item };
