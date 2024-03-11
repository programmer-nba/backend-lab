const { Signature } = require("../../models/item/signature.models");

exports.create = async (req, res) => {
  try {
    await new Signature({
      ...req.body,
    }).save();
    res
      .status(201)
      .send({ message: "เพิ่มข้อมุล Signature สำเร็จ", status: true });
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
    const new_item = await Signature.findByIdAndUpdate(id, {
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
    const item = await Signature.find();
    if (item.length > 0) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูล Signature สำเร็จ",
        data: item,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูล Signature", status: false });
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
    const item = await Signature.findById(id);
    if (item) {
      return res.status(200).send({
        status: true,
        message: "ดึงข้อมูล Signature สำเร็จ",
        data: item,
      });
    } else {
      return res
        .status(404)
        .send({ message: "ไม่พบข้อมูล Signature", status: false });
    }
  } catch (error) {
    res.status(500).send({
      message: "มีบางอย่างผิดพลาด",
      status: false,
    });
  }
};
exports.deleteItem = async (req, res) => {
  try {
    const id = req.params.id;
    const item = await Signature.findByIdAndDelete(id);
    if (!item) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูล  Signature" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ลบข้อมูล Signature สำเร็จ" });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};
