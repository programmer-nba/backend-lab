const { Chain } = require('../../models/Chain/chain.models'); 
const { SubChain } = require('../../models/Chain/subchain.models'); 
const { Work } = require("../../models/Chain/work.models");
const LabParam = require('../../models/Chain/labparam.models');
const Bottles = require('../../models/Chain/bottles.model')
const { ItemAnalysis } = require('../../models/item/analysis.item.models');
const multer = require("multer");

const storage = multer.diskStorage({ 
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const { uploadFileCreate, deleteFile } = require("../../funtions/uploadfilecreate");
const QRCode = require('qrcode');
const dayjs = require("dayjs");

// chains
exports.createChain = async (req, res) => {
    const {
        work_code, work_id, work_location, work_customer,
        quotation_code, quotation_id,
        domain,
        subtitle,
        analysis,
        map,
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
        const ref_params = await ItemAnalysis.find()
        const formatted_params = params.map(param=>{
            const ref_param = ref_params.find(val => val._id.toString() === param.ref_id)
            const result = {
                ref_id: ref_param?._id,
                name: ref_param?.name || param.name,
                method: param.method,
                amount: param.amount,
                job_type: ref_param?.job_type,
                bottle_type: ref_param?.bottle_type,
                tag: ref_param?.tag,
                unit: ref_param?.unit || param.unit
            }
            return result
        })
        const code = await genCode(new Date())

        const work = await Work.findOne( { work_no: work_code } )
        if (!work) {
            return res.status(404).json({
                message: 'ไม่พบ JOB',
                status: false,
                data: null
            })
        }

        const data = {
            work: {
                code: work_code,
                _id: work?._id
            },
            jobType: work?.jobType,
            jobSubType: work?.jobSubType,
            jobCode: work?.jobCode,
            quotation: {
                code: quotation_code,
                _id: quotation_id
            },
            customer: work_customer,
            location: work?.location,
            map: map,
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
            },
            qr_code_img: "",
            qr_code_link: ""
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
        //const cur_domain = domain || 'http://147.50.183.57:4681/LAB/chain/sub/scan'
        //const qr_link = `${cur_domain}/${saved_chain.code}/${saved_chain.customer.secret}`
        const qr_data = {
            _id: saved_chain._id.toString(),
            code: saved_chain.code,
            secret: saved_chain.customer.secret
        }
        const qr_data_str = JSON.stringify(qr_data);
        console.log(qr_data_str)
        QRCode.toDataURL(qr_data_str, async function (err, url) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: err,
                    status: false,
                    data: null
                });
            }

            let cur_chain = await Chain.findById(saved_chain._id)
            if (!cur_chain) {
                return res.status(404).json({
                    message: "chain not found",
                    status: false,
                    data: null
                })
            }

            cur_chain.qr_code_img = url
            cur_chain.qr_data = qr_data

            const saved_cur_chain = await cur_chain.save()
            if (!saved_cur_chain) {
                return res.status(500).json({
                    message: 'can not save cur chain',
                    status: false,
                    data: null
                })
            }

            return res.status(201).json({
                message: 'saved data successfully',
                status: true,
                data: cur_chain
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

exports.updateChainMap = async (req, res) => {
    const {
        map,
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
        chain.map = map || chain.map

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

exports.getChain = async (req, res) => {
    const { id } = req.params
    try{
        const data = await Chain.findById( id );
        if (!data) {
            return res.status(404).json({
                message: "chain not found",
                data: null,
                status: false
            })
        }
        return res.status(200).send({data: data, status: true});
    } catch (error) {
        return res.status(500).send({message:error.message, status: false});
    }
}

exports.deleteChain = async (req, res) => {
    const { id } = req.params
    try {
        // Delete the chain
        await Chain.findByIdAndDelete(id);

        // Find all subchains related to the chain
        const subChains = await SubChain.find({ 'chain._id': id });
        console.log(subChains.length)

        // Extract subchain ids
        const subChainIds = subChains.map(subChain => subChain._id);
        console.log(subChainIds)

        // Delete subchains
        const delete_subChains = await SubChain.deleteMany({ 'chain._id': id });
        if (!delete_subChains) {
            return res.send({
                message: 'can not cascade subchains',
                status: false,
                data: null
            })
        }

        // Delete lab parameters associated with subchains
        const delete_labParams = await LabParam.deleteMany({ 'subChain._id': { $in: subChainIds } })
        if (!delete_labParams) {
            return res.json({
                message: 'can not cascade labParams',
                status: false,
                data : null
            })
        }

        return res.json({
            message: 'Delete successful',
            status: true,
            data: null
        });
    } catch (error) {
        return res.status(500).send({ message: error.message, status: false });
    }
}

// subchains
exports.createSubChain = async (req, res) => {
    const {
        chain_code,
        chain_id,
        date,
        period,
        chain_point,
        chain_location,
        customer,
        date_string,
        rider_name,
        rider_code,
        prepared_name,
        prepared_code,
        sender_name,
        sender_code,
        map,
        day,
        month
    } = req.body

    try {
        let chain = await Chain.findById(chain_id)
        if (!chain) {
            return res.status(404).json({
                message: "chain not found",
                status: true,
                data: null
            })
        }
        if (chain.chaincount === chain.frequency) {
            return res.json({
                message: "สร้าง chain ครบจำนวนแล้ว",
                status: false,
                data: `${chain.chaincount}/${chain.frequency}`
            })
        }

        const code = `${chain.code}/${month}`
        const point = chain_point.join(',')
        const data = {
            code: code,
            period: period,
            chain: {
                code: chain_code,
                _id: chain_id
            },
            jobType: chain?.jobType,
            jobSubType: chain?.jobSubType,
            jobCode: chain?.jobCode,
            date: date || new Date(),
            date_string: date_string || "",
            day: day || new Date(date)?.getDay(),
            month: month,
            year: chain.collect_year,
            status: {
                code: 'new',
                name: 'ใหม่',
                updatedBy: sender_name && sender_code ? `${sender_name} ${sender_code}` : null,
                updatedAt: new Date()
            },
            location: chain_location,
            map: chain.map,
            point: point,
            customer: customer,
            rider: {
                name: rider_name,
                code: rider_code
            },
            prepared: {
                name: prepared_name,
                code: prepared_code
            }
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

        const new_params = chain.params.map( p => {
            //const index = chain.params.findIndex(i => i === p)
            const param = 
                {
                    subChain: {
                        code: saved_subChain.code,
                        _id: saved_subChain._id,
                        date: saved_subChain.date,
                        date_string: saved_subChain.date_string,
                    },
                    analysis: {
                        code: null,
                        name: null
                    },
                    bottle_type: p.bottle_type || "-",
                    jobType: p.jobType,
                    bottle_qr: "-",
                    bottle_tag: `${p.name}-${saved_subChain.code}`,
                    bottle_status: false,
                    name: p.name,
                    method: p.method,
                    ref: p.ref || '-',
                    base: p.base,
                    max: p.max,
                    result: null,
                    result_status: false,
                    status: {
                        code: "new",
                        name: "ใหม่",
                        updatedAt: new Date(),
                        updatedBy: "-"
                    },
                    img_collected: null,
                }
            return param
        })

        const labParams = await LabParam.insertMany(new_params)
        if(!labParams) {
            return res.status(500).json({
                message: "can not create lab params",
                status: false,
                data: null
            })
        }

        const month_id = chain.collect_month.find(m => m.month === month)?._id

        chain.chaincount += 1
        chain.status = [...chain.status, {
            code: 'onProcess',
            name: `กำลังดำเนินการ`,
            updatedAt: new Date(),
            updatedBy: 'admin'
        }]
        chain.subChain.push({
            sub_id: saved_subChain._id,
            month_id: month_id,
            month: month,
            date: saved_subChain.date,
            period: saved_subChain.period   
        })
        const saved_chain = await chain.save()
        if (!saved_chain) {
            return res.status(500).json({
                message: "can not plus count",
                status: false,
                data: null
            })
        }

        return res.status(201).json({
            message: `created successfully paramsx${labParams.length}`,
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
        sender_code,
        period,
        date,
        rider_name,
        rider_code
    } = req.body

    try {
        let subChain = await SubChain.findById(id)
        subChain.prepared = {
            code:sender_code,
            name: sender_name
        }
        subChain.status = status_code && status_name ? [...subChain.status, {
            code: status_code,
            name: status_name,
            updatedBy: sender_name && sender_code ? `${sender_name} ${sender_code}` : null,
            updatedAt: new Date()
        }] : [...subChain.status]
        subChain.period = period || subChain.period
        subChain.date = date || subChain.date
        subChain.rider.code = rider_code || subChain.rider?.code
        subChain.rider.name = rider_name || subChain.rider?.name
        
        const saved_subChain = await subChain.save()
        if (!saved_subChain) {
            return res.status(500).json({
                message: 'can not update!',
                status: false,
                data: null
            })
        }

        let chain = await Chain.findById( saved_subChain.chain._id )
        if (!chain) {
            return res.status(404).json({
                message: "chain _id not founded",
                status: false,
                data: null
            })
        }

        const subInChain = chain.subChain.findIndex(sub => sub.sub_id === id)
        if (subInChain === -1) {
            return res.status(404).json({
                message: "subChain not found",
                status: false,
                data: chain
            })
        }

        chain.subChain[subInChain].date = saved_subChain.date || chain.subChain[subInChain].date
        chain.subChain[subInChain].period = saved_subChain.period || chain.subChain[subInChain].period

        const updated_chain = await chain.save()
        if (!updated_chain) {
            return res.status(500).json({
                message: "can not updated chain",
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

exports.scanToCollect = async (req, res) => {
    const { id, secret } = req.params
    const { rider_name, rider_code } = req.body
    try {
        let subChain = await SubChain.findById( id )
        if (!subChain) {
            return res.status(404).json({
                message: 'not found',
                status: false,
                data: null
            })
        }

        if (subChain.customer.secret !== secret) {
            return res.status(404).json({
                message: 'รหัส secret ไม่ถูกต้อง',
                status: false,
                data: `correct secret is ${subChain.customer.secret}`
            })
        }

        const new_status = {
            code: "collecting",
            name: "กำลังเก็บตัวอย่าง",
            updatedAt: new Date(),
            updatedBy: `${rider_name} ${rider_code}`
        }
        subChain.status = [...subChain.status, new_status]

        const saved = await subChain.save()
        if(!saved) {
            return res.status(500).json({
                message: 'can not saved',
                status: false,
                data: null
            })
        }
        /* QRCode.toDataURL('http://lab.nbadigitalsuccessmore.com', function (err, url) {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: 'Error generating QR code',
                    status: false,
                    data: null
                });
            }
            const qrcode = url;

            return res.send(`
                <html>
                    <head>
                        <title>Response Message</title>
                        <script>
                            alert('ยืนยันการตรวจแล้ว');
                            setTimeout(function() {
                                window.location.href = 'http://lab.nbadigitalsuccessmore.com';
                            }, 5000);
                        </script>
                    </head>
                    <body style="font-size: 32px;">
                        <strong>ยืนยันการตรวจแล้ว</strong>
                        <p>รหัส chain : ${saved.chain.code}</p>
                        <p>วันที่ : ${formatDate(new Date())}</p>
                        <p>ลูกค้า : ${saved.customer.name}</p>
                        <img src="${qrcode}" alt="qrcode">
                    </body>
                </html>
            `);
        }); */

        return res.status(200).json({
            message: 'success',
            status: true,
            data: saved
        })

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
                console.log(src)

                if (upload_type === 'img_1') {
                    subChain.img_1 = src
                } else if (upload_type === 'img_2') {
                    subChain.img_2 = src
                } else if (upload_type === 'img_3') {
                    subChain.img_3 = src
                } else if (upload_type === 'img_4') {
                    subChain.img_4 = src
                } else if (upload_type === 'img_5') {
                    subChain.img_5 = src
                } else if (upload_type === 'img_6') {
                    subChain.img_6 = src
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

            return res.status(200).send({
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
        console.log(err.message)
        return res.status(500).json({
            message: err.message,
            status: false,
            data: null
        })
    }
}

// Bottles
exports.createBottle = async (req, res) => {
    const {
        subChain_id,
        bottle_type,
        jobTag,
        params,
    } = req.body
    try {
        const subChain = await SubChain.findById( subChain_id )
        if (!subChain) {
            return res.status(404).json({
                message: "ไม่พบไอดี subchain",
                status: false,
                data: null
            })
        }
        
        //const number = await Bottles.countDocuments({ subChain: subChain_id })
        const bottle_tag = `${jobTag || subChain.jobCode}-${subChain.chain.code}-${params.length}`

        const new_bottle = new Bottles({
            subChain: subChain_id,
            bottle_tag: bottle_tag,
            bottle_status: false,
            bottle_type: bottle_type,
            bottle_qr: null,
            params: [...params]
        })
        const saved_bottle = await new_bottle.save()
        if (!saved_bottle) {
            return res.status(500).json({
                message: "ไม่สามารถสร้างขวดใหม่ได้",
                status: false,
                data: null
            })
        }

        return res.status(201).json({
            message: `สร้างขวดสำเร็จ มีพารามิเตอร์ ${saved_bottle.params.length}`,
            status: true,
            data: saved_bottle
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

exports.updateBottle = async (req, res) => {
    const {
        params,
        bottle_status,
    } = req.body
    const { id } = req.params
    try {
        
        let bottle = await Bottles.findById( id )
        if (! bottle) {
            return res.status(404).json({
                message: "ไม่พบขวดนี้",
                status: false,
                data: null
            })
        }

        const subChain = await SubChain.findById( bottle.subChain._id )
        if (!subChain) {
            return res.status(404).json({
                message: "ไม่พบไอดี subchain",
                status: false,
                data: null
            })
        }
        
        //const number = await Bottles.countDocuments({ subChain: subChain_id })
        const bottle_tag = `${jobTag || subChain.jobCode}-${subChain.chain.code}-${params.length}`

        bottle.bottle_status = bottle_status || bottle.bottle_status
        bottle.params = params || bottle.params
        bottle.code = bottle_tag || bottle.code

        const updated_bottle = await bottle.save()
        if (!updated_bottle) {
            return res.status(500).json({
                message: "ไม่สามารถอัพเดทขวดได้",
                status: false,
                data: null
            })
        }

        return res.status(201).json({
            message: `อัพเดทขวดสำเร็จ มีพารามิเตอร์ ${updated_bottle.params.length}`,
            status: true,
            data: updated_bottle
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

exports.getBottles = async (req, res) => {
    try {
        let bottles = await Bottles.find( )
        if (! bottles) {
            return res.status(404).json({
                message: "ไม่พบขวด",
                status: false,
                data: null
            })
        }

        return res.status(201).json({
            message: `มีขวดทั้งหมด ${bottles.length}`,
            status: true,
            data: bottles
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

exports.getBottlesBySubChain = async (req, res) => {
    const { subChain_id } = req.params
    try {
        let bottles = await Bottles.find( {subChain: subChain_id} )
        if (! bottles) {
            return res.status(404).json({
                message: "ไม่พบขวด",
                status: false,
                data: null
            })
        }

        return res.status(201).json({
            message: `มีขวดทั้งหมด ${bottles.length}`,
            status: true,
            data: bottles
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

exports.getBottle = async (req, res) => {
    const { id } = req.params
    try {
        let bottle = await Bottles.findById( id )
        if (! bottle) {
            return res.status(404).json({
                message: "ไม่พบขวด",
                status: false,
                data: null
            })
        }

        return res.status(201).json({
            message: `พบขวดแล้ว`,
            status: true,
            data: bottle
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

exports.deleteBottle = async (req, res) => {
    const { id } = req.params
    try {
        
        let bottle = await Bottles.findByIdAndDelete( id )
        if (! bottle) {
            return res.status(404).json({
                message: "ไม่พบขวดนี้",
                status: false,
                data: null
            })
        }

        return res.status(201).json({
            message: 'ลบขวดแล้ว',
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

// Lab params
exports.createLabParam = async (req, res) => {
    const {
        subChain_code,
        subChain_id,
        subChain_date,
        subChain_date_string,
        
        analysis_code,
        analysis_name,
        //prepared_code,
        //prepared_name,
        
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
        //prepared_code,
        //prepared_name,
        //rider_name,
        //rider_code,
        bottle_tag,
        bottle_type,
        bottle_qr,
        bottle_status,
        ref,
        base,
        max,
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
        /* labParam.prepared.code = prepared_code || labParam.prepared.code
        labParam.prepared.name = prepared_name || labParam.prepared.name
        labParam.rider.code = rider_code || labParam.prepared.code
        labParam.rider.name = rider_name || labParam.prepared.name */
        labParam.bottle_type = bottle_type || labParam.bottle_type
        labParam.bottle_tag = bottle_tag || labParam.bottle_tag
        labParam.bottle_qr = bottle_qr || labParam.bottle_qr
        labParam.bottle_status = bottle_status || labParam.bottle_status
        //labParam.ref = ref || labParam.ref
        //labParam.base = base || labParam.base
        labParam.max = max || labParam.max
        labParam.result = result || labParam.result
        labParam.result_status = result_status || labParam.result_status
        labParam.status = 
            status_code && status_name
            ? [
                ...labParam.status, 
                {
                    code: status_code,
                    name: status_name,
                    updatedBy: `${analysis_name || 'ฝ่ายขวด'} ${analysis_code || 'ฝ่ายขวด'}`,
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

exports.scanBottle = async (req, res) => {
    const { id } = req.params
    try {
        let subChain = await SubChain.findByIdAndUpdate( id, {
            $push : {
                status: {
                    code: "",
                    name: "",
                    createdAt: new Date(),
                    updatedBy: "scan"
                }
            }
        }, { new : true } )
        if (!subChain) {
            return res.status(404).send('ไม่พบข้อมูล')
        } else if (subChain.length < 1) {
            return res.send('ขออภัย ขณะนี้ยังไม่สามารถเข้ารับงานได้')
        }

        const new_status = {
            code: "collecting",
            name: "กำลังเก็บตัวอย่าง",
            updatedAt: new Date(),
            updatedBy: "scan"
        }
        
        if(!saved) {
            return res.status(500).json({
                message: 'can not saved',
                status: false,
                data: null
            })
        }

        return res.send(`
            <html>
                <head>
                    <title>Response Message</title>
                    <script>
                        alert('ยืนยันการตรวจแล้ว');
                        setTimeout(function() {
                            window.location.href = 'http://lab.nbadigitalsuccessmore.com';
                        }, 5000);
                    </script>
                </head>
                <body style="font-size: 32px;">
                    <strong>ยืนยันการตรวจแล้ว</strong>
                    <p>รหัส chain : ${saved.chain.code}</p>
                    <p>วันที่ : ${formatDate(new Date())}</p>
                    <p>ลูกค้า : ${saved.customer.name}</p>
                    <img src="${qrcode}" alt="qrcode">
                </body>
            </html>
        `);
        
    } catch(error){
        return res.status(500).json({
            message: error.message, 
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

async function genCode(date) {
    const sal = await Chain.find();
    let lastDoc = sal[0]

    if (sal.length > 0) {
        lastDoc = sal[sal.length-1]
    } else {
        lastDoc = sal[0]
    }
    
    const lastDocCode = lastDoc.code.slice(-4);
    const incremented = (parseInt(lastDocCode) + 1).toString();

    const currentYear = new Date().getFullYear();
    const yearOffset = currentYear - 1957;

    let num = incremented // Increment based on the number of existing quotations

    // Format the date as YYMM
    const formattedDate = dayjs(date).year(yearOffset).format("YYMM");
    
    // Pad the number with leading zeros if necessary
    const paddedNum = String(num).padStart(4, "0");

    const jobnumber = `CH${formattedDate}${paddedNum}`;

    return jobnumber;
}