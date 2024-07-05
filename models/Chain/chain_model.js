const mongoose = require("mongoose")
const { Schema } = mongoose

const chainNewSchema = new Schema(
    {
        quotation: { type: String, require: true },
        sampling_by: { type: String, default: "" },
        control_by: { type: String, default: "" },
        report_no: { type: String, default: "" },
        measure_time: { type: String, default: "" },
        params: { type: Array, default: [] },
    },
    {
        timestamps: true
    }
)

const ChainNew = mongoose.model("ChainNew", chainNewSchema)
module.exports = ChainNew