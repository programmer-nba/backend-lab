const {Chain} = require('../../models/Chain/chain.models');
const {SubChain} = require('../../models/Chain/subchain.models');
const {ItemAnalysis} = require('../../models/item/analysis.item.models');
const dayjs = require("dayjs");

//admin กำหนดวันที่จะไป ทีม rider และ สร้างใบ workchains
exports.add = async (req, res) => {
    try{

        const chains_id = req.body.chains_id;
        const detail = await Chain.findById(chains_id);
        if(!detail){
            return res.status(400).send({message: "ไม่พบข้อมูล chains", status: false});
        }
        const date = req.body.date;
        const details = req.body.details;

        let num = 0
        for (const item of details) {
          let selectdetail = detail.chaindetail.details.find((item2) => item2._id == item._id);
          if (selectdetail.length != 0) {
            let numgen = 0;
            let refno = "";
            const gendetailPromises = [];
            for (const element of selectdetail.params) {
                const subdata = await SubChain.find();
                refno = `BOTTEL-${dayjs(Date.now()).format("YYYYMMDD")}` + String(subdata.length).padStart(4, '0') + "-" + String(numgen).padStart(4, '0');
                console.log(refno);
                numgen++;
                const analysis = await ItemAnalysis.findOne({ name: element.name });
                let bottletype = "";
                if (analysis == undefined) {
                    bottletype = "ไม่มีประเภทขวด"
                } else {
                    bottletype = analysis?.bottletype;
                }
            
                gendetailPromises.push({
                    name: element.name,
                    method: element.method,
                    amount: element.amount,
                    amount_unit: element.amount_unit,
                    freq: element.freq,
                    freq_unit: element.freq_unit,
                    unit_price: element.unit_price,
                    total_price: element.total_price,
                    discount: element.discount,
                    cost: element.cost,
                    bottelref: refno,
                    bottletype: bottletype,
                });
            }
          
              const data = new SubChain({
                  quotation: detail.quotation,
                  work_id: detail.work_id,
                  chains_id: chains_id,
                  subchains_no: await jobsub(),
                  subchaindetail: {
                      points: selectdetail.points,
                      chaincount: selectdetail.chaincount,
                      frequency: selectdetail.frequency,
                      frequency_text: selectdetail.frequency_text,
                      collect_month: selectdetail.collect_month,
                      collect_year: selectdetail.collect_year,
                      amount_point: selectdetail.amount_point,
                      params: gendetailPromises,
                  },
                  date: date[num]?.subchaindate,
                  status: "จัดเตรียมขวด",
              })
              const add = await data.save();
          }
          num++;
        }

        

        return res.status(200).send({message: "admin กำหนดวันให้ rider สำเร็จ", status: true});

    } catch(error){
        return res.status(500).send({message:error.message, status: false});
    }

}

//ดึงข้อมูล
exports.getall = async (req, res) => {
    try{
        const data = await SubChain.find().populate("quotation");
        return res.status(200).send({data: data, status: true});
    } catch(error){
        return res.status(500).send({message:error.message, status: false});
    }
} 

//ดึงข้อมูลตาม id
exports.getbyid = async (req, res) => {
    try{
        const id = req.params.id;
        const data = await SubChain.findById(id).populate("quotation");;
        if(!data){
            return res.status(400).send({message: "ไม่พบข้อมูล", status: false});
        }
        const bottle  = []
        data.detail.forEach((item) => {
            item.work_details.forEach((item2) => {
                item2.project_details.forEach((item3) => {
                    item3.sub_detail.forEach((item4) => {
                        bottle.push(item4);
                    })
                })
            })
        });
        return res.status(200).send({data: data,bottle:bottle, status: true});
        
    }
    catch(error){
        return res.status(500).send({message:error.message, status: false});
    }
}

const multer = require("multer");

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
    // console.log(file.originalname);
  },
});
const {
  uploadFileCreate,
  deleteFile,
} = require("../../funtions/uploadfilecreate");


// จัดเตรียมสำเร็จ
exports.preparesuccess = async (req, res) => { 
  try{
    let upload = multer({ storage: storage }).array("img", 20);
    upload(req, res, async function (err) {
      const reqFiles = [];
      const result = [];
      if (err) {
        return res.status(500).send(err);
      }
      const id = req.params.id;
      const workchain = await WorkChain.findById(id);
      if(!workchain){
        return res.status(400).send({message: "ไม่พบข้อมูล workchain", status: false});
      }
      const bottel_id = req.body.bottel_id;
      let image = ""; // ตั้งตัวแปรรูป
      if (req.files) {
        const url = req.protocol + "://" + req.get("host");
        for (var i = 0; i < req.files.length; i++) {
          const src = await uploadFileCreate(req.files, res, { i, reqFiles });
          result.push(src);
        }
        image = reqFiles[0];
      }

      const data = await WorkChain.findByIdAndUpdate(id, {evidencebottel:image,status:"จัดเตรียมเสร็จแล้ว",bottel:bottel_id},{new:true});
      return res.status(200).send({message: "จัดเตรียมเสร็จแล้ว",data :data, status: true});
         
    });

  }catch(error){
    return res.status(500).send({message:error.message, status: false});
  }
} 




async function jobsub(date) {
    const sal = await SubChain.find();
    let jobnumber = null;
    if (sal.length !== 0) {
      let data = "";
      let num = 0;
      let check = null;
      do {
        num = num + 1;
        data = `SUBCHAIN-${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
        check = await SubChain.find({ jobnumber: data });
        if (check.length === 0) {
          jobnumber =
            `SUBCHAIN-${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
        }
      } while (check.length !== 0);
    } else {
      jobnumber = `SUBCHAIN-${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
    }
    return jobnumber;
  }

  async function bottelref(date) {
    const sal = await WorkChain.find();
    let jobnumber = null;
    if (sal.length !== 0) {
      let data = "";
      let num = 0;
      let check = null;
      do {
        num = num + 1;
        data = `WORK${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
        check = await WorkChain.find({ jobnumber: data });
        if (check.length === 0) {
          jobnumber =
            `WORK${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + num;
        }
      } while (check.length !== 0);
    } else {
      jobnumber = `WORK${dayjs(date).format("YYYYMMDD")}`.padEnd(10, "0") + "1";
    }
    return jobnumber;
  }