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
      secret: String
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
        name: String,
        method: String,
        amount: Number,
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
    qr_code_link: String
  },
  {
    timestamps: true
  }
)

const Chain = mongoose.model("chain", chainSchema);
module.exports = { Chain };
