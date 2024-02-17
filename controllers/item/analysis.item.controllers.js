const { ItemAnalysis } = require("../../models/item/analysis.item.models");

exports.create = async (req, res) => {
  try {
    const item = await ItemAnalysis.findOne({
      name: req.body.name,
    });
    if (item)
      return res.status(409).send({
        status: false,
        message: "มีชื่อวิธีการวิเคราะห์นี้อยู่ในระบบเเล้ว",
      });
    await new ItemAnalysis({
      ...req.body,
    }).save();
    res.status(201).send({ message: "เพิ่มข้อมุลงานสำเร็จ", status: true });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.EditItem = async (req, res) => {
  try {
    const id = req.params.id;
    if (!req.body) {
      return res
        .status(400)
        .send({ status: false, message: error.details[0].message });
    }
    const new_item = await ItemAnalysis.findByIdAndUpdate(id, {
      ...req.body,
    });
    if (new_item) {
      return res.send({
        status: true,
        message: "เเก้ไขวิธีการวิเคราะห์สำเร็จ",
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "เเก้ไขวิธีการวิเคราะห์ไม่สำเร็จ",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
