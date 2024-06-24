const mongoose = require("mongoose");

const toolSchema = new mongoose.Schema(
    {
        name: { type: String, require: true },
        type: { type: String, require: true },
        brand: { type: String, require: true },
        generation: { type: String, require: true },
        serial_no: { type: String, require: true },
        standard: { type: String, require: true },
        calibration: { type: String, default: "-" },
        calibration_next: { type: String, default: "-" },
        calibration_status: { type: String, default: "ปกติ" },
        register_status: { type: String, require: true },
        certificate_status : { type: String, require: true },
        components: { type: Array, default: [] },
        avaliable: { type: Boolean, default: true },
        current_holder: { type: String, require: true, default: "คลัง" },
    },
    {
        timestamps: true
    }
)
const Tool = mongoose.model("Tool", toolSchema);

const toolTypeSchema = new mongoose.Schema(
    {
        type: { type: String, require: true },
    },
    {
        timestamps: false
    }
)
const ToolType = mongoose.model("ToolType", toolTypeSchema);

const toolBrandSchema = new mongoose.Schema(
    {
        brand: { type: String, require: true },
        generation: { type: String, require: true },
    },
    {
        timestamps: false
    }
)
const ToolBrand = mongoose.model("ToolBrand", toolBrandSchema);

const toolStandardSchema = new mongoose.Schema(
    {
        standard: { type: String, require: true }
    },
    {
        timestamps: false
    }
)
const ToolStandard = mongoose.model("ToolStandard", toolStandardSchema);

const toolCalibrateStatusSchema = new mongoose.Schema(
    {
        calibration_status: { type: String, require: true }
    },
    {
        timestamps: false
    }
)
const ToolCalibrateStatus = mongoose.model("ToolCalibrateStatus", toolCalibrateStatusSchema);

const toolRegisterStatusSchema = new mongoose.Schema(
    {
        register_status: { type: String, require: true }
    },
    {
        timestamps: false
    }
)
const ToolRegisterStatus = mongoose.model("ToolRegisterStatus", toolRegisterStatusSchema);

const toolCertificateStatusSchema = new mongoose.Schema(
    {
        certificate_status: { type: String, require: true }
    },
    {
        timestamps: false
    }
)
const ToolCertificateStatus = mongoose.model("ToolCertificateStatus", toolCertificateStatusSchema);

const toolLogSchema = new mongoose.Schema(
    {
        tool: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "Tool" },
        old_holder: { type: String, require: true },
        current_holder: { type: String, require: true },
        detail: { type: String, require: true },
        date: { type: String, require: true },
        time: { type: String, require: true },
    },
    {
        timestamps: true
    }
)
const ToolLog = mongoose.model("ToolLog", toolLogSchema);

module.exports = { Tool, ToolLog, ToolType, ToolBrand, ToolStandard, ToolCalibrateStatus, ToolRegisterStatus, ToolCertificateStatus };