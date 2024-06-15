const mongoose = require("mongoose");

const analysisItemSchema = new mongoose.Schema(
  {
    name:{ type: String, default: "-" },
    tag: { type: String, default: "" },
    bottle_type:{ type: String, default: '-' },
    active: { type: Boolean, default: true },
    job_type: String,
    analysis_by: { type: String, default: "SPJ" },
    method: { type: String, default: "-" },
    unit: { type: String, default: "-" },
    price: { type: Number, default: 0 },
    employee_id: { type: String, default: "-" }
  },
  {
    timestamps: true
  }
)

const ItemAnalysis = mongoose.model("ItemAnalysis", analysisItemSchema)
module.exports = { ItemAnalysis }
