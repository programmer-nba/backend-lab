const mongoose = require("mongoose");

const analysisItemSchema = new mongoose.Schema(
  {
    name:{ type: String, default: "" },
    tag: String,
    bottle_type:{ type: String, default: 'ขวดพลาสติก ขวดแก้ว' },
    active: { type: Boolean, default: true },
    job_type: String,
    analysis_by: { type: String, default: "SPJ" },
    method: { type: String, default: "" },
    unit: { type: String, default: "" },
    price: { type: Number, default: 0 },
    employee: {
      name: String,
      code: String,
      _id: String,
      username: String
    }
  },
  {
    timestamps: true
  }
)

const ItemAnalysis = mongoose.model("ItemAnalysis", analysisItemSchema)
module.exports = { ItemAnalysis }
