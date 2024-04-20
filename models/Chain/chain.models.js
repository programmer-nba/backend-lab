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
    map: String,
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
    collect_month: {
      type: [
          {
              month: String,
              amount: Number
          }
      ],
      required: false,
      default: null
    },
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
        unit: String,
        jobType: String,
        ref: String,
        bottle_type: String
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
    qr_data: String,
    subChain: [
      {
        sub_id: String,
        month_id: String,
        month: String,
        date: Date,
        period: Number,
      }
    ]
  },
  {
    timestamps: true
  }
)

const Chain = mongoose.model("chain", chainSchema);
module.exports = { Chain };
