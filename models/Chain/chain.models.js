const mongoose = require("mongoose");

const chainSchema = new mongoose.Schema(
  {
    work: {
      code: String,
      _id: String
    },
    quotation: {
      code: String,
      _id: String
    },
    location: String,
    customer: {
      name: String,
      contract_name: String,
      contract_tel: String,
      secret: String,
      email: String
    },
    code: String,
    subtitle: String,
    analysis: String,
    total_amount_points: Number,
    points: [ String ],
    chaincount: Number,
    frequency: Number,
    frequency_text: String,
    collect_month: [ String ],
    collect_year: String,
    amount_point: Number,
    params: [
      {
        ref_id: String,
        name: String,
        tag: String,
        method: String,
        amount: Number,
        base: Number,
        ref: String
      }
    ],
    status: [
      {
        code: String,
        name: String,
        updatedAt: Date,
        updatedBy: String
      }
    ],
    qr_code_img: String,
    qr_data: String
  },
  {
    timestamps: true
  }
)

const Chain = mongoose.model("chain", chainSchema);
module.exports = { Chain };
