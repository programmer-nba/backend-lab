const ChainNew = require("../../models/Chain/chain_model")
import dayjs from "dayjs"
import "dayjs/locale/th"
import buddhistEra from "dayjs/plugin/buddhistEra"

dayjs.extend(buddhistEra)
dayjs.locale("th")

const dateFormatTH = () => {
    dayjs.locale("th")
    return dayjs(date).format("BBMMDD")
}

const generateCode = (chainLength, length) => {
    const newCodeNumber = chainLength
    const code = newCodeNumber.toString().padStart(length, '0')
    return code
}

exports.createChain = async(req, res) => {
    const {
        quotation,
        sampling_by,
        control_by,
        report_no,
        measure_time,
        params,
    } = req.body
    try {
        const dateCode = dateFormatTH(new Date())
        const chainLength = await ChainNew.find()
        const code = 'CN' + dateCode + generateCode(chainLength.length, 3)
        const newData = {
            code: code,
            quotation: quotation,
            sampling_by: sampling_by,
            control_by: control_by,
            report_no: report_no,
            measure_time: measure_time,
            params: params,
        }
        const chain = await ChainNew.create(newData)
        if (!chain) {
            return res.status(400).json({ message: "ไม่สามารถบันทึกข้อมูล" })
        }

        return res.status(200).json({
            message: "success",
            status: true,
            data: chain
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

exports.updateChain = async(req, res) => {
    const {
        quotation,
        sampling_by,
        control_by,
        report_no,
        measure_time,
        params,
        code
    } = req.body
    const { id } = req.params
    try {
        if (!id) {
            return res.status(400).json({ message: "ไม่พบ _id ของ chain ที่แนบมา" })
        }
        
        const existChain = await ChainNew.findById(id)
        if (!existChain) {
            return res.status(404).json({ message: "ไม่พบ chain นี้ในระบบ" })
        }

        const chain = await ChainNew.findByIdAndUpdate(id, {
            $set: {
                code: code,
                quotation: quotation,
                sampling_by: sampling_by,
                control_by: control_by,
                report_no: report_no,
                measure_time: measure_time,
                params: params
            },
            $push: {
                
            }
        }, { new: true })
        if (!chain) {
            return res.status(400).json({ message: "ไม่สามารถบันทึกข้อมูล" })
        }

        return res.status(201).json({
            message: "success",
            status: true,
            data: chain
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

exports.getChains = async(req, res) => {
    const { qt } = req.query
    try {
        let chains = []
        if (qt) {
            chains = await ChainNew.find({ quotation: qt })
        } else {
            chains = await ChainNew.find()
        }

        return res.status(201).json({
            message: `have ${chains.length} chains`,
            status: true,
            data: chains
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

exports.getChain = async(req, res) => {
    const { id } = req.params
    try {
        const chain = await ChainNew.findById(id)
        if (!chain) {
            return res.status(404).json({ message: "ไม่พบ chain นี้ในระบบ" })
        }

        return res.status(200).json({
            message: `success`,
            status: true,
            data: chain
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}

exports.deleteChain = async(req, res) => {
    const { id } = req.params
    try {
        const chain = await ChainNew.findByIdAndDelete(id)
        if (!chain) {
            return res.status(404).json({ message: "ไม่พบ chain นี้ในระบบ" })
        }

        return res.status(200).json({
            message: `success`,
            status: true,
        })
    }
    catch(err){
        console.log(err)
        return res.status(500).json({ message: err.message })
    }
}