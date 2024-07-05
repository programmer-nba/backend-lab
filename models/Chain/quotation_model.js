const mongoose = require("mongoose")
const { Schema } = mongoose

const customer_term = {
    analysis_method: "",
    report_method: "",
    sent_method: "",
    report_type: ""
}

const quotationNewSchema = new Schema(
    {
        code: { type: String, default: "" },
        customer: { type: Object, require: true },
        sampling_location: { type: String, require: true },
        chains: { type: Array, default: [] },
        offer_name: { type: Object, default: { name: "", _id: "", tel: "" } },

        total_price: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        after_discount: { type: Number, default: 0 },
        vat_percent: { type: Number, default: 7 },
        total_vat: { type: Number, default: 0 },
        net_price: { type: Number, default: 0 },
        withholding_percent: { type: Number, default: 0 },
        withholding_price: { type: Number, default: 0 },

        start_date: { type: String, default: "" },
        due_date: { type: String, default: "" },
        credit: { type: Number, default: 0 },

        customer_review: { type: String, default: "" },
        customer_term: { type: Object, default: customer_term }
    }, 
    {
        timestamps: true
    }
)

const QuotationNewSchema = mongoose.model("QuotationNewSchema", quotationNewSchema)
module.exports = QuotationNewSchema