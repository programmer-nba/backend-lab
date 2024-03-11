const { ItemAnalysis } = require("../../models/item/analysis.item.models");

exports.create = async (req, res) => {
  try {
      const item = new ItemAnalysis({
        name: req.body.name,
        bottletype: req.body.bottletype,
        methods: req.body.methods,
      })
      const result = await item.save();
      return res.status(200).send({ status: true, message: "เพิ่มวิธีการวิเคราะห์สำเร็จ", data: result});
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message });
  }
};


exports.EditItem = async (req, res) => {
  try {
    const id = req.params.id;
    const analysis = await ItemAnalysis.findById(id);
    if (!analysis) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลวิธีการวิเคราะห์" });
    }

    const data = {
      name: req.body.name,
      bottletype: req.body.bottletype,
      methods: req.body.methods,
    }
    const item = await ItemAnalysis.findByIdAndUpdate(id, data,{new:true});
    return res.status(200).send({ status: true, message: "แก้ไขวิธีการวิเคราะห์สำเร็จ", data: item});

    
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: err.message });
  }
};

exports.GetAllIem = async (req, res) => {
  try {
    const analysis = await ItemAnalysis.find();
    return res.status(200).send({ status: true, message: "ดึงข้อมูลวิธีการวิเคราะห์สำเร็จ", data: analysis});
  } catch (error) {
     return res
      .status(500)
      .send({ status: false, message: err.message });
  }
};

exports.GetAllIemByid = async (req, res) => {
  try {
    const analysis = await ItemAnalysis.findById(req.params.id);
    if(!analysis) return res.status(404).send({ status: false, message: "ไม่พบข้อมูลวิธีการวิเคราะห์"});
    return res.status(200).send({ status: true, message: "ดึงข้อมูลวิธีการวิเคราะห์สำเร็จ", data: analysis});
  } catch (error) {
     return res
      .status(500)
      .send({ status: false, message: err.message });
  }
};

exports.deleteItemAnalysis = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await ItemAnalysis.findByIdAndDelete(id);
    if (!item) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลวิธีการวิเคราะห์ร" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูลวิธีการวิเคราะห์รสำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    const result = await ItemAnalysis.deleteMany({});

    if (result.deletedCount > 0) {
      return res
        .status(200)
        .send({
          status: true,
          message: "ลบข้อมูลวิธีการวิเคราะห์ทั้งหมดสำเร็จ",
        });
    } else {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูลวิธีการวิเคราะห์" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
