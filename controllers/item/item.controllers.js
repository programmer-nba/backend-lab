const { Item } = require("../../models/item/item.models");

exports.create = async (req, res) => {
  try {
    const item = await Item.findOne({
      name: req.body.name,
    });
    if (item)
      return res.status(409).send({
        status: false,
        message: "มีชื่องานนี้อยู่ในระบบเเล้ว",
      });
    await new Item({
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
    const new_item = await Item.findByIdAndUpdate(id, {
      ...req.body,
    });
    if (new_item) {
      return res.send({
        status: true,
        message: "เเก้ไขข้อมุลรายละเอียดสำเร็จ",
      });
    } else {
      return res.status(400).send({
        status: false,
        message: "เเก้ไขข้อมุลรายละเอียดไม่สำเร็จ",
      });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
exports.GetAllIem = async (req, res) => {
  try {
    const item = await Item.find();
    if (item.length > 0) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลรายละเอียดโครงการสำเร็จ",
        data: item,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูลรายละเอียดโครงการ", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
exports.GetAllIemByid = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Item.findById(id);
    if (item) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูลรายละเอียดโครงการสำเร็จ",
        data: item,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูลรายละเอียดโครงการ", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};