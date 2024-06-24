const { Tool, ToolLog, ToolType, ToolBrand, ToolStandard, ToolCalibrateStatus, ToolRegisterStatus, ToolCertificateStatus } = require("../../models/item/tools.model")
const dayjs = require('dayjs')
const buddhistEra = require("dayjs/plugin/buddhistEra")
dayjs.extend(buddhistEra)

// Tool
exports.createTool = async (req, res) => {
    const {
        type,
        brand,
        generation,
        serial_no,
        standard,
        calibration,
        calibration_next,
        calibration_status,
        register_status,
        certificate_status,
        components,
    } = req.body

    try {
        const name = `${type || ""} ${brand || ""} ${generation || ""}`
        const newTool = {
            name: name,
            type: type,
            brand: brand,
            generation: generation,
            serial_no: serial_no,
            standard: standard,
            calibration: calibration,
            calibration_next: calibration_next,
            calibration_status: calibration_status,
            register_status: register_status,
            certificate_status: certificate_status,
            components: components,
        }

        const tool = await Tool.create(newTool)
        if (!tool) {
            return res.status(500).json({
                message: "can not create tool"
            })
        }

        return res.status(200).json({
            message: "create tool success",
            status: true,
            data: tool
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.updateTool = async (req, res) => {
    const {
        type,
        brand,
        generation,
        serial_no,
        standard,
        calibration,
        calibration_next,
        calibration_status,
        register_status,
        certificate_status,
        components,
        avaliable,
        current_holder,
        detail
    } = req.body

    const { id } = req.params

    try {
        const existTool = await Tool.findById(id)
        if (!existTool) {
            return res.status(404).json({
                message: "tool not found"
            })
        }
        const name = `${type || existTool.type} ${brand || existTool.brand} ${generation || existTool.generation}`
        const tool = await Tool.findByIdAndUpdate(id, {
            $set: {
                name: name,
                type: type,
                brand: brand,
                generation: generation,
                serial_no: serial_no,
                standard: standard,
                calibration: calibration,
                calibration_next: calibration_next,
                calibration_status: calibration_status,
                register_status: register_status,
                certificate_status: certificate_status,
                components: components,
                avaliable: avaliable,
                current_holder: current_holder
            }
        }, { new: true })

        if (current_holder) {
            const data = {
                tool: tool._id || id,
                old_holder: existTool.current_holder,
                current_holder: tool.current_holder,
                detail: detail || 'เบิกอุปกรณ์',
            }
            const toolLog = await createToolLog(data)
            if (!toolLog) {
                return res.status(400).json({
                    message: "can not create log"
                })
            }
        }

        return res.status(200).json({
            message: "update tool success",
            status: true,
            data: tool
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getTool = async (req, res) => {

    const { id } = req.params

    try {
        const tool = await Tool.findById(id)
        if (!tool) {
            return res.status(404).json({
                message: "tool not found"
            })
        }

        return res.status(200).json({
            message: `success`,
            status: true,
            data: tool
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getTools = async (req, res) => {
    try {
        const tools = await Tool.find()

        return res.status(200).json({
            message: `have ${tools.length} tools`,
            status: true,
            data: tools
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteTool = async (req, res) => {

    const { id } = req.params

    try {
        const tool = await Tool.findByIdAndDelete(id)
        if (!tool) {
            return res.status(404).json({
                message: "tool not found"
            })
        }

        return res.status(200).json({
            message: `success`,
            status: true,
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

// ToolLog
const createToolLog = async (data) => {
    const {
        tool,
        old_holder,
        current_holder,
        detail,
    } = data

    try {
        const curDate = new Date()
        const date = dayjs(curDate).format('DD/MM/BBBB')
        const time = dayjs(curDate).format('HH:mm')

        const newToolLog = {
            tool: tool,
            old_holder: old_holder,
            current_holder: current_holder,
            detail: detail,
            date: date,
            time: time
        }

        const toolLog = await ToolLog.create(newToolLog)
        if (!toolLog) {
            return false
        }

        return true
    }
    catch (err) {
        console.log(err)
        return false
    }
}

exports.updateToolLog = async (req, res) => {
    const {
        tool,
        old_holder,
        current_holder,
        detail,
    } = req.body

    const { id } = req.params

    try {
        const curDate = new Date()
        const date = dayjs(curDate).format('DD/MM/BBBB')
        const time = dayjs(curDate).format('HH:mm')

        const toolLog = await ToolLog.findByIdAndUpdate(id, {
            $set: {
                tool: tool,
                old_holder: old_holder,
                current_holder: current_holder,
                detail: detail,
                date: date,
                time: time
            }
        }, { new: true })
        if (!toolLog) {
            return res.status(404).json({
                message: "can not update tool log"
            })
        }

        return res.status(200).json({
            message: "update tool log success",
            status: true,
            data: toolLog
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getToolLogs = async (req, res) => {
    try {
        const toolLogs = await ToolLog.find()

        return res.status(200).json({
            message: `have ${toolLogs.length} logs`,
            status: true,
            data: toolLogs
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteToolLog = async (req, res) => {

    const { id } = req.params

    try {
        const toolLog = await ToolLog.findByIdAndDelete(id)
        if (!toolLog) {
            return res.status(404).json({
                message: "tool not found"
            })
        }

        return res.status(200).json({
            message: `success`,
            status: true,
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

// ToolType
exports.createToolType = async (req, res) => {
    const { type } = req.body
    try {
        const toolType = await ToolType.create({
            type: type
        })
        if (!toolType) {
            return res.status(500).json({
                message: "can not create tool type"
            })
        }

        return res.status(200).json({
            message: "create tool type success",
            status: true,
            data: toolType
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.updateToolType = async (req, res) => {
    const { type } = req.body
    const { id } = req.params
    try {
        const toolType = await ToolType.findByIdAndUpdate(id, {
            $set: { type: type }
        }, { new: true })
        if (!toolType) {
            return res.status(404).json({
                message: "can not update tool type"
            })
        }

        return res.status(200).json({
            message: "update tool type success",
            status: true,
            data: toolType
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getToolTypes = async (req, res) => {
    try {
        const toolTypes = await ToolType.find()

        return res.status(200).json({
            message: `have ${toolTypes.length} types`,
            status: true,
            data: toolTypes
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteToolType = async (req, res) => {
    const { id } = req.params
    try {
        const toolType = await ToolType.findByIdAndDelete(id)
        if (!toolType) {
            return res.status(404).json({
                message: "type not found"
            })
        }

        return res.status(200).json({
            message: `success`,
            status: true,
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}


// ToolBrand
exports.createToolBrand = async (req, res) => {
    const { brand, generation } = req.body
    try {
        const toolBrand = await ToolBrand.create({
            brand: brand,
            generation: generation
        })
        if (!toolBrand) {
            return res.status(500).json({
                message: "can not create tool brand"
            })
        }

        return res.status(200).json({
            message: "create tool brand success",
            status: true,
            data: toolBrand
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.updateToolBrand = async (req, res) => {
    const { brand, generation } = req.body
    const { id } = req.params
    try {
        const toolBrand = await ToolBrand.findByIdAndUpdate(id, {
            $set: { brand: brand, generation: generation }
        }, { new: true })
        if (!toolBrand) {
            return res.status(404).json({
                message: "can not update tool brand"
            })
        }

        return res.status(200).json({
            message: "update tool brand success",
            status: true,
            data: toolBrand
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getToolBrands = async (req, res) => {
    try {
        const toolBrands = await ToolBrand.find()

        return res.status(200).json({
            message: `have ${toolBrands.length} brands`,
            status: true,
            data: toolBrands
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteToolBrand = async (req, res) => {
    const { id } = req.params
    try {
        const toolBrand = await ToolBrand.findByIdAndDelete(id)
        if (!toolBrand) {
            return res.status(404).json({
                message: "brand not found"
            })
        }

        return res.status(200).json({
            message: `success`,
            status: true,
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

// ToolStandard
exports.createToolStandard = async (req, res) => {
    const { standard } = req.body
    try {
        const toolStandard = await ToolStandard.create({
            standard: standard
        })
        if (!toolStandard) {
            return res.status(500).json({
                message: "can not create tool standard"
            })
        }

        return res.status(200).json({
            message: "create tool standard success",
            status: true,
            data: toolStandard
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.updateToolStandard = async (req, res) => {
    const { standard } = req.body
    const { id } = req.params
    try {
        const toolStandard = await ToolStandard.findByIdAndUpdate(id, {
            $set: { standard: standard }
        }, { new: true })
        if (!toolStandard) {
            return res.status(404).json({
                message: "can not update tool standard"
            })
        }

        return res.status(200).json({
            message: "update tool standard success",
            status: true,
            data: toolStandard
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getToolStandards = async (req, res) => {
    try {
        const toolStandards = await ToolStandard.find()

        return res.status(200).json({
            message: `have ${toolStandards.length} standards`,
            status: true,
            data: toolStandards
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteToolStandard = async (req, res) => {
    const { id } = req.params
    try {
        const toolStandard = await ToolStandard.findByIdAndDelete(id)
        if (!toolStandard) {
            return res.status(404).json({
                message: "standard not found"
            })
        }

        return res.status(200).json({
            message: `success`,
            status: true,
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

// ToolCalibrateStatus
exports.createToolCalibrateStatus = async (req, res) => {
    const { calibration_status } = req.body
    try {
        const calibrate = await ToolCalibrateStatus.create({
            calibration_status: calibration_status
        })
        if (!calibrate) {
            return res.status(500).json({
                message: "can not create calibration status"
            })
        }

        return res.status(200).json({
            message: "create calibration status success",
            status: true,
            data: calibrate
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.updateToolCalibrateStatus = async (req, res) => {
    const { calibration_status } = req.body
    const { id } = req.params
    try {
        const calibrate = await ToolCalibrateStatus.findByIdAndUpdate(id, {
            $set: { calibration_status: calibration_status }
        }, { new: true })
        if (!calibrate) {
            return res.status(404).json({
                message: "can not update calibrate"
            })
        }

        return res.status(200).json({
            message: "update tool calibrate success",
            status: true,
            data: calibrate
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getToolCalibrateStatuses = async (req, res) => {
    try {
        const calibrates = await ToolCalibrateStatus.find()

        return res.status(200).json({
            message: `have ${calibrates.length} calibrates`,
            status: true,
            data: calibrates
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteToolCalibrateStatus = async (req, res) => {
    const { id } = req.params
    try {
        const calibrate = await ToolCalibrateStatus.findByIdAndDelete(id)
        if (!calibrate) {
            return res.status(404).json({
                message: "calibrate not found"
            })
        }

        return res.status(200).json({
            message: `success`,
            status: true,
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

// ToolRegisterStatus
exports.createToolRegisterStatus = async (req, res) => {
    const { register_status } = req.body
    try {
        const register = await ToolRegisterStatus.create({
            register_status: register_status
        })
        if (!register) {
            return res.status(500).json({
                message: "can not create register status"
            })
        }

        return res.status(200).json({
            message: "create register status success",
            status: true,
            data: register
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.updateToolRegisterStatus = async (req, res) => {
    const { register_status } = req.body
    const { id } = req.params
    try {
        const register = await ToolRegisterStatus.findByIdAndUpdate(id, {
            $set: { register_status: register_status }
        }, { new: true })
        if (!register) {
            return res.status(404).json({
                message: "can not update register"
            })
        }

        return res.status(200).json({
            message: "update tool register success",
            status: true,
            data: register
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getToolRegisterStatuses = async (req, res) => {
    try {
        const registers = await ToolRegisterStatus.find()

        return res.status(200).json({
            message: `have ${registers.length} registers`,
            status: true,
            data: registers
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteToolRegisterStatus = async (req, res) => {
    const { id } = req.params
    try {
        const register = await ToolRegisterStatus.findByIdAndDelete(id)
        if (!register) {
            return res.status(404).json({
                message: "register not found"
            })
        }

        return res.status(200).json({
            message: `success`,
            status: true,
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}


// ToolCertificateStatus
exports.createToolCertificateStatus = async (req, res) => {
    const { certificate_status } = req.body
    try {
        const certify = await ToolCertificateStatus.create({
            certificate_status: certificate_status
        })
        if (!certify) {
            return res.status(500).json({
                message: "can not create certificate status"
            })
        }

        return res.status(200).json({
            message: "create certificate status success",
            status: true,
            data: certify
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.updateToolCertificateStatus = async (req, res) => {
    const { certificate_status } = req.body
    const { id } = req.params
    try {
        const certify = await ToolCertificateStatus.findByIdAndUpdate(id, {
            $set: { certificate_status: certificate_status }
        }, { new: true })
        if (!certify) {
            return res.status(404).json({
                message: "can not update certify"
            })
        }

        return res.status(200).json({
            message: "update tool certify success",
            status: true,
            data: certify
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.getToolCertificateStatuses = async (req, res) => {
    try {
        const certifies = await ToolCertificateStatus.find()

        return res.status(200).json({
            message: `have ${certifies.length} certificates`,
            status: true,
            data: certifies
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}

exports.deleteToolCertificateStatus = async (req, res) => {
    const { id } = req.params
    try {
        const certify = await ToolCertificateStatus.findByIdAndDelete(id)
        if (!certify) {
            return res.status(404).json({
                message: "certify not found"
            })
        }

        return res.status(200).json({
            message: `success`,
            status: true,
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message
        })
    }
}
