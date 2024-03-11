const mongoose = require("mongoose");
const Joi = require("joi");

const ItemReportSchema = new mongoose.Schema({
  report: {
    freq: { type: Number, required: false },
    freq_unit: { type: String, required: false },
    unit_price: { type: Number, required: false },
    total_price: { type: Number, required: false },
    detail: [{ type: String, required: false }],
    sent: [{ type: String, required: false }],
  },
});

const ItemReport = mongoose.model("ItemReport", ItemReportSchema);

module.exports = { ItemReport };
