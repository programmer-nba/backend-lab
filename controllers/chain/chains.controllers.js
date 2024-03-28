
const { Chain } = require('../../models/Chain/chain.models'); 
const { SubChain } = require('../../models/Chain/subchain.models'); 
const LabParam = require('../../models/Chain/labparam.models');
const multer = require("multer");
const storage = multer.diskStorage({ 
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});
const { uploadFileCreate, deleteFile } = require("../../funtions/uploadfilecreate");


// chains
exports.createChain = async (req, res) => {
    const {
        work_code, work_id, work_location, work_customer,
        quotation_code, quotation_id,
        subtitle,
        analysis,
        points,
        frequency,
        frequency_text,
        collect_month,
        collect_year,
        amount_point,
        total_amount_points,
        params,
        sender_name,
        sender_code
    } = req.body
    try {
        const chains = await Chain.find()
        const formatted_params = params.map(param=>{
            const result = {
                name: param.name,
                method: param.method,
                amount: param.amount
            }
            return result
        })
        const code = genCode(chains.length, null)

        const data = {
            work: {
                code: work_code,
                _id: work_id
            },
            quotation: {
                code: quotation_code,
                _id: quotation_id
            },
            customer: work_customer,
            location: work_location,
            code: code,
            subtitle: subtitle,
            analysis: analysis,
            total_amount_points: total_amount_points,
            points: [ ...points ],
            chaincount: 0,
            frequency: frequency,
            frequency_text: frequency_text,
            collect_month: [ ...collect_month ],
            collect_year: collect_year,
            amount_point: amount_point,
            params: formatted_params,
            status: {
                code: 'new',
                name: 'ใหม่',
                updatedBy: `${sender_name} ${sender_code}`,
                updatedAt: new Date()
            }
        }

        const new_chain = new Chain(data)
        const saved_chain = await new_chain.save()
        if (!saved_chain) {
            return res.status(500).json({
                message: 'can not save data!',
                status: false,
                data: null
            })
        }

        return res.status(201).json({
            message: 'saved data successfully',
            status: true,
            data: saved_chain
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

exports.updateChainStatus = async (req, res) => {
    const {
        status_code,
        status_name,
        sender_name,
        sender_code
    } = req.body
    const { id } = req.params
    try {
        let chain = await Chain.findById( id )
        if (!chain) {
            return res.status(404).json({
                message: 'not found',
                status: false,
                data: null
            })
        }
        chain.status = 
            status_code && status_name 
            ? [...chain.status,{
                code: status_code,
                name: status_name,
                updatedBy: sender_name && sender_code ? `${sender_name} ${sender_code}` : null,
                updatedAt: new Date()
            }] 
            : chain.status

        const updated_chain = await chain.save()
        if (!updated_chain) {
            return res.status(500).json({
                message: 'can not update data!',
                status: false,
                data: null
            })
        }

        return res.status(201).json({
            message: 'updated data successfully',
            status: true,
            data: updated_chain
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

exports.getChains = async (req, res) => {
    try{
        const data = await Chain.find();
        return res.status(200).send({data: data, status: true});
    } catch (error) {
        return res.status(500).send({message:error.message, status: false});
    }
}

// subchains
exports.createSubChain = async (req, res) => {
    const {
        chain_code,
        chain_id,
        date,
        chain_point,
        chain_location,
        customer,
        date_string,
        sender_name,
        sender_code
    } = req.body

    try {
        const map = ""
        const subChains = await SubChain.find()
        const genedcode = genCode(subChains.length, date)
        const subChain_code = `CHAIN-${genedcode}`
        const point = chain_point.join(',')
        const data = {
            code: subChain_code,
            chain: {
                code: chain_code,
                _id: chain_id
            },
            date: date || new Date(),
            date_string: date_string || "",
            status: {
                code: 'new',
                name: 'ใหม่',
                updatedBy: sender_name && sender_code ? `${sender_name} ${sender_code}` : null,
                updatedAt: new Date()
            },
            location: chain_location,
            map: map,
            point: point,
            customer: customer,
        }

        const new_subChain = new SubChain(data)
        const saved_subChain = await new_subChain.save()
        if (!saved_subChain) {
            return res.status(500).json({
                message: 'can not save!',
                status: false,
                data: null
            })
        }

        return res.status(201).json({
            message: 'created successfully',
            status: true,
            data: saved_subChain
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

exports.updateSubChainStatus = async (req, res) => {
    const { id } = req.params
    const {
        status_name,
        status_code,
        sender_name,
        sender_code
    } = req.body

    try {
        let subChain = await SubChain.findById(id)
        
        subChain.status = status_code && status_name ? [...subChain.status, {
            code: status_code,
            name: status_name,
            updatedBy: sender_name && sender_code ? `${sender_name} ${sender_code}` : null,
            updatedAt: new Date()
        }] : [...subChain.status]
        
        const saved_subChain = await subChain.save()
        if (!saved_subChain) {
            return res.status(500).json({
                message: 'can not update!',
                status: false,
                data: null
            })
        }

        return res.status(201).json({
            message: 'successfully',
            status: true,
            data: saved_subChain
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

exports.getSubChains = async (req, res) => {
    try{
        const subChains = await SubChain.find();
        return res.status(200).json({
            message: `data ${subChains.length}`,
            data: subChains, 
            status: true
        });

    } catch(error){
        return res.status(500).json({
            message: error.message, 
            status: false,
            data: null
        })
    }
}

exports.getSubChainsRider = async (req, res) => {
    try{
        const subChains = await SubChain.find();
        return res.status(200).json({
            message: `data ${subChains.length}`,
            data: subChains, 
            status: true
        });

    } catch(error){
        return res.status(500).json({
            message: error.message, 
            status: false,
            data: null
        })
    }
}

exports.getSubChainsByMain = async (req, res) => {
    const { chain_id } = req.params
    try {
        const subChains = await SubChain.find( { 'chain._id' : chain_id } );
        return res.status(200).json({
            message: `data ${subChains.length}`,
            data: subChains, 
            status: true
        });

    } catch(error){
        return res.status(500).json({
            message: error.message, 
            status: false,
            data: null
        })
    }
}

exports.getSubChain = async (req, res) => {
    const { id } = req.params
    try {
        const subChain = await SubChain.findById( id )
        if (!subChain) {
            return res.status(404).json({
                message: 'not found',
                status: false,
                data: null
            })
        }
        return res.status(200).json({
            message: `founded!`,
            data: subChain, 
            status: true
        });

    } catch(error){
        return res.status(500).json({
            message: error.message, 
            status: false,
            data: null
        })
    }
}

exports.getSubChainByMainCode = async (req, res) => {
    const { code } = req.params
    try {
        const subChains = await SubChain.find( { 'chain.code' : code } )
        if (!subChains) {
            return res.status(404).json({
                message: 'not found',
                status: false,
                data: null
            })
        }

        const curSubChain = subChains[subChains.length-1]

        return res.status(200).json({
            message: `founded!`,
            data: curSubChain,
            datas: subChains,
            status: true
        });

    } catch(error){
        return res.status(500).json({
            message: error.message, 
            status: false,
            data: null
        })
    }
}

exports.deleteSubChain = async (req, res) => {
    const { id } = req.params
    try {
        const subChain = await SubChain.findByIdAndDelete( id )
        if (!subChain) {
            return res.status(404).json({
                message: 'not found',
                status: false,
                data: null
            })
        }
        return res.status(200).json({
            message: `deleted!`,
            data: null, 
            status: true
        });

    } catch(error){
        return res.status(500).json({
            message: error.message, 
            status: false,
            data: null
        })
    }
}

exports.uploadPictureSubChain = async (req, res) => {
    const { id } = req.params
    try {
        let upload = multer({ storage: storage }).array("imgCollection", 20)
        upload(req, res, async function (err) {
            const { upload_type } = req.body
            if (err) {
                return res.status(500).send(err);
            }
            const reqFiles = [];
            const result = [];

            let subChain = await SubChain.findById( id )
            if (!subChain) {
                return res.status(404).json({
                    message: 'not founded',
                    status: false,
                    data: null
                })
            }

            for (let i = 0; i < req.files.length; i++) {
                const src = await uploadFileCreate(req.files, res, { i, reqFiles });
                result.push(src);
                reqFiles.push(src)

                if (upload_type === 'collecteds') {
                    subChain.img_collecteds = src
                } else if (upload_type === 'prepareds') {
                    subChain.img_prepareds = src
                } else if (upload_type === 'getbottles') {
                    subChain.img_getbottles = src
                }
            }

            const saved_subChain = await subChain.save()
            if (!saved_subChain) {
                return res.status(500).json({
                    message: "can not saved",
                    status: false,
                    data: null
                })
            }

            return res.status(200).json({
                message: 'uploaded successfully',
                status: true,
                data: {
                    upload_type: req.body.upload_type,
                    upload_img: result[0]
                }
            })
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

// Lab params
exports.createLabParam = async (req, res) => {
    const {
        subChain_code,
        subChain_id,
        subChain_date,
        subChain_date_string,
        
        analysis_code,
        analysis_name,
        prepared_code,
        prepared_name,
        
        bottle_tag,
        bottle_type,
        bottle_qr,

        name, 
        method
    } = req.body
    
    try {
        const param = {
            subChain: {
                code: subChain_code,
                _id: subChain_id,
                date: subChain_date,
                date_string: subChain_date_string || "",
            },
            analysis: {
                code: analysis_code || null,
                name: analysis_name || null
            },
            prepared: {
                code: prepared_code || null,
                name: prepared_name || null
            },
            bottle_tag: bottle_tag || null,
            bottle_type: bottle_type || null,
            bottle_qr: bottle_qr || null,
            bottle_status: false,
            name: name,
            method: method,
            ref: "",
            base: null,
            result: null,
            result_status: false,
            status: {
                code: 'new',
                name: 'ใหม่',
                updatedBy: `${analysis_name || prepared_name} ${analysis_code || prepared_code}`,
                updatedAt: new Date(),
            }
        }
        
        const new_param = new LabParam(param)
        const saved_param = await new_param.save()
        if (!saved_param) {
            return res.status(500).json({
                message: 'ไม่สามารถบันทึกข้อมูล',
                status: false,
                data: null
            })
        }
        
        return res.status(201).json({
            message: 'บันทึกข้อมูลสำเร็จ',
            status: true,
            data: saved_param
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

exports.createLabParams = async (req, res) => {
    const { labParams } = req.body
    
    try {
        const params = labParams.map(data => {
            const param = {
                subChain: {
                    code: data.subChain_code,
                    _id: data.subChain_id,
                    date: data.subChain_date,
                    date_string: data.subChain_date_string || "",
                },
                analysis: {
                    code: data.analysis_code || null,
                    name: data.analysis_name || null
                },
                prepared: {
                    code: data.prepared_code || null,
                    name: data.prepared_name || null
                },
                bottle_tag: data.bottle_tag || null,
                bottle_type: data.bottle_type || null,
                bottle_qr: data.bottle_qr || null,
                bottle_status: false,
                name: data.name,
                method: data.method,
                ref: "",
                base: null,
                result: null,
                result_status: false,
                status: {
                    code: 'new',
                    name: 'ใหม่',
                    updatedBy: `${data.analysis_name || data.prepared_name} ${data.analysis_code || data.prepared_code}`,
                    updatedAt: new Date(),
                }
            }
            return param
        })
        
        const saved_params = await LabParam.insertMany(params)
        if (!saved_params) {
            return res.status(500).json({
                message: 'ไม่สามารถบันทึกข้อมูล',
                status: false,
                data: null
            })
        }
        
        return res.status(201).json({
            message: `บันทึกข้อมูลสำเร็จ x${saved_params.length}`,
            status: true,
            data: saved_params
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

exports.updateLabParam = async (req, res) => {
    const {
        analysis_code,
        analysis_name,
        prepared_code,
        prepared_name,
        rider_name,
        rider_code,
        bottle_tag,
        bottle_type,
        bottle_qr,
        bottle_status,
        ref,
        base,
        result,
        result_status,
        status_code,
        status_name
    } = req.body

    const { id } = req.params
    
    try {
        let labParam = await LabParam.findById( id )
        if (!labParam) {
            return res.status(404).json({
                message: 'not found',
                status: false,
                data: null
            })
        }

        labParam.analysis.code = analysis_code || labParam.analysis.code
        labParam.analysis.name = analysis_name || labParam.analysis.name
        labParam.prepared.code = prepared_code || labParam.prepared.code
        labParam.prepared.name = prepared_name || labParam.prepared.name
        labParam.rider.code = rider_code || labParam.prepared.code
        labParam.rider.name = rider_name || labParam.prepared.name
        labParam.bottle_type = bottle_type || labParam.bottle_type
        labParam.bottle_tag = bottle_tag || labParam.bottle_tag
        labParam.bottle_qr = bottle_qr || labParam.bottle_qr
        labParam.bottle_status = bottle_status || labParam.bottle_status
        labParam.ref = ref || labParam.ref
        labParam.base = base || labParam.base
        labParam.result = result || labParam.result
        labParam.result_status = result_status || labParam.result_status
        labParam.status = 
            status_code && status_name
            ? [
                ...labParam.status, 
                {
                    code: status_code,
                    name: status_name,
                    updatedBy: `${analysis_name || prepared_name} ${analysis_code || prepared_code}`,
                    updatedAt: new Date()
                }
            ] 
            : [...labParam.status]

        const updated_labParam = await labParam.save()
        if (!updated_labParam) {
            return res.status(500).json({
                message: 'can not update',
                status: false,
                data: null
            })
        }
        
        return res.status(201).json({
            message: 'บันทึกข้อมูลสำเร็จ',
            status: true,
            data: updated_labParam
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

exports.getLabParams = async (req, res) => {
    try {
        const labParams = await LabParam.find()
        
        return res.status(201).json({
            message: `datas : ${labParams.length}`,
            status: true,
            data: labParams
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

exports.getLabParamsBySubChain = async (req, res) => {
    const { subChain_id } = req.params 
    try {
        const labParams = await LabParam.find({ 'subChain._id' : subChain_id })
        
        return res.status(201).json({
            message: `datas : ${labParams.length}`,
            status: true,
            data: labParams
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

exports.getLabParam = async (req, res) => {
    const { id } = req.params 
    try {
        const labParam = await LabParam.findById( id )
        if (!labParam) {
            return res.status(404).json({
                message: 'not founded',
                status: false,
                data: null
            })
        }
        return res.status(201).json({
            message: `founded`,
            status: true,
            data: labParam
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

exports.deleteLabParam = async (req, res) => {
    const { id } = req.params 
    try {
        const labParam = await LabParam.findByIdAndDelete( id )
        if (!labParam) {
            return res.status(404).json({
                message: 'not founded',
                status: false,
                data: null
            })
        }
        return res.status(201).json({
            message: `deleted`,
            status: true,
            data: null
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

exports.uploadPictureLabParam = async (req, res) => {
    const { id } = req.params
    try {
        let upload = multer({ storage: storage }).array("imgCollection", 20)
        upload(req, res, async function (err) {
            const { upload_type } = req.body
            if (err) {
                return res.status(500).send(err);
            }
            const reqFiles = [];
            const result = [];

            let labParam = await LabParam.findById( id )
            if (!labParam) {
                return res.status(404).json({
                    message: 'not founded',
                    status: false,
                    data: null
                })
            }

            for (let i = 0; i < req.files.length; i++) {
                const src = await uploadFileCreate(req.files, res, { i, reqFiles });
                result.push(src);
                reqFiles.push(src)
                console.log(upload_type)
                labParam.img_collected = (upload_type === 'collected') ? src : labParam.img_collected
            }

            const saved_labParam = await labParam.save()
            if (!saved_labParam) {
                return res.status(500).json({
                    message: "can not saved",
                    status: false,
                    data: null
                })
            }

            return res.status(200).json({
                message: 'uploaded successfully',
                status: true,
                data: {
                    upload_type: req.body.upload_type,
                    upload_img: saved_labParam.img_collected
                }
            })
        })
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

const genCode = (length, date) => {
    const gendate = date ? formatDateToYYYYMMDD(date) : formatDateToYYYYMMDD(new Date())
    const genlength =
        length >= 0 && length < 10 ? `000${length}`
        : length >= 10 && length < 100 ? `00${length}`
        : length >= 100 && length < 1000 ? `0${length}`
        : `${length}`
    return `${gendate}${genlength}`
}

function formatDateToYYYYMMDD(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}

