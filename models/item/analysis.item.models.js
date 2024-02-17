const mongoose = require("mongoose");
const Joi = require("joi");

const AnalysisItemSchema = new mongoose.Schema({
  name: { type: String, required: false }, //วิธีการวิเคราะห์
});

const ItemAnalysis = mongoose.model("ItemAnalysis", AnalysisItemSchema);

module.exports = { ItemAnalysis };
