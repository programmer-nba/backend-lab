const {SubChain} = require('../../models/Chain/subchain.models');

// ดึงข้อมูล subchains ทั้งหมด
exports.getall = async (req, res) => {
    try{
        const data = await SubChain.find();
        return res.status(200).send({data: data, status: true});
    } catch(error){
        return res.status(500).send({message:error.message, status: false});
    }
}

