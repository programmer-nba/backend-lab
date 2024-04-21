const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const Joi = require("joi");
const fs = require("fs");
const { google } = require("googleapis");
const { default: axios } = require("axios");
const req = require("express/lib/request.js");
const { Work } = require("../../models/Chain/work.models");
const { Chain } = require('../../models/Chain/chain.models'); 
const { SubChain } = require('../../models/Chain/subchain.models'); 
const LabParam = require('../../models/Chain/labparam.models');
const Bottles = require('../../models/Chain/bottles.model')

const multer = require("multer");
const jwt = require("jsonwebtoken");
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

exports.getWorkAlls = async (req, res) => {
  try {
    const data = await Work.find().populate("quotation");
    if (!data) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูล chain ในระบบ" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: data });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};


exports.getWorkById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Work.findById(id).populate("quotation");
    if (!data) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูล Work ในระบบ" });
    } else {
      return res
        .status(200)
        .send({ status: true, message: "ดึงข้อมูลสำเร็จ", data: data });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด" });
  }
};


exports.deleteWork = async (req, res) => {
  try {
    const id = req.params.id;
    const work = await Work.findById(id);
    if (!work) {
      return res
        .status(404)
        .send({ status: false, message: "ไม่พบข้อมูล Work" });
    }

    const work_code = work.work_no
    await Work.deleteOne( { _id: id } ).exec();

    const chains = await Chain.find({ 'work.code' : work_code }).exec();
    console.log(chains.length)

    if (chains.length > 0) {
      const chainIds = chains.map(chain => chain._id);
      console.log(chainIds)
      await Chain.deleteMany({ '_id': { $in: chainIds } }).exec();

      const subChains = await SubChain.find( { 'chain._id' : { $in: chainIds } } )
      if (subChains.length > 0) {
        const subChains_id = subChains.map(sub => sub._id)
        const deleted_subChains = await SubChain.deleteMany({ 'chain._id': { $in: chainIds } }).exec();
        console.log(`${deleted_subChains.deletedCount} subchains removed.`);

        const deleted_subBottles = await Bottles.deleteMany({ 'subChain': { $in: subChains_id } }).exec();
        console.log(`${deleted_subBottles.deletedCount} bottles removed.`);

        const deleted_Params = await LabParam.deleteMany({ 'subChain._id': { $in: subChains_id } }).exec();
        console.log(`${deleted_Params.deletedCount} params removed.`);
      }
    }

    return res
      .status(200)
      .send({ status: true, message: "ลบข้อมูล Work สำเร็จ" });
    
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .send({ status: false, message: "มีบางอย่างผิดพลาด"});
  }
};
