const {SubChain} = require('../../models/Chain/subchain.models');
const {WorkChain} = require('../../models/Chain/workchain.models');
const dayjs = require("dayjs");

//admin กำหนดวันที่จะไป ทีม rider และ สร้างใบ workchains
exports.add = async (req, res) => {
    try{

        const subchains_id = req.body.subchains_id;
        const date = req.body.date;
        const sub_detail = req.body.sub_detail;

        const subchain = await SubChain.findById(subchains_id);
        if(!subchain){
            return res.status(400).send({message: "ไม่พบข้อมูล subchains", status: false});
        }
        // const newsubdetail = sub_detail.map((item) => {
        //     return {
        //       bottelref: bottelref(),
        //       sub_name: item.sub_name,
        //       name_analysis: item.name_analysis,
        //       amount: item.amount,
        //       type_amount: item.type_amount,
        //       frequency: item.frequency,
        //       type_frequency: item.type_frequency,
        //       rider: item.rider,
        //       evidenceget: item.evidenceget,
        //       analysis: item.analysis,
        //       fillvalues: item.fillvalues,
        //     };
        // });
        // console.log(newsubdetail);
        const mapdetail = subchain.detail.map((item) => {
            return {
              name_work: item.name_work,
              work_details: [
                {
                  project_name: item.work_details[0].project_name,
                  project_details: item.work_details[0].project_details.map((item2) => {
                    return {
                      detail_name: item2.detail_name, 

                      sub_detail:sub_detail,
                    }
                  }),
                },
              ]
            };
          })

        const data = new WorkChain( {
            quotation:subchain.quotation,
            chains_id:subchain.chains_id,
            subchains_id: subchains_id,
            jobnumber: await jobnumber(), //เลข
            employee_name: subchain.employee_name, //คนทำรายการ หรือผุ้เสนอราคา
            tax_id_company: subchain.tax_id_company, //เลขประจำตัวผู้เสียภาษี
            company:subchain.company, //ข้อมูลบริษัทตัวเอง
            customer_company: subchain.customer_company, //ข้อมูลบริษัทลูกค้า
            customer_detail: subchain.customer_detail, //ข้อมูลลูกค้า
            date: date,
            detail:mapdetail,
            count : subchain.allcount+1 , //ครั้งที่กรอก
            endcount: subchain.allendcount, //จำนวนรอบทั้งหมด
            status: "จัดเตรียมขวด",
            evidencebottel:"", //หลักฐานที่เก็บตัวอย่างขวด
        })

        const add = await data.save();
        return res.status(200).send({message: "admin กำหนดวันให้ rider สำเร็จ",data :add, status: true});

    } catch(error){
        return res.status(500).send({message:error.message, status: false});
    }

}

//ดึงข้อมูล
exports.getall = async (req, res) => {
    try{
        const data = await WorkChain.find();
        return res.status(200).send({data: data, status: true});
    } catch(error){
        return res.status(500).send({message:error.message, status: false});
    }
} 

//ดึงข้อมูลตาม id
exports.getbyid = async (req, res) => {
    try{
        const id = req.params.id;
        const data = await WorkChain.findById(id);
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




async function jobnumber(date) {
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