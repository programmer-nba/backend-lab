const { ItemAnalysis } = require("../../models/item/analysis.item.models");

exports.createItem = async (req, res) => {
  const { 
    name,
    tag,
    bottle_type,
    job_type,
    analysis_by,
    method,
    unit,
    price,
    employee_id
   } = req.body

  try {
    const item = new ItemAnalysis({
      name: name,
      tag: tag,
      bottle_type: bottle_type,
      job_type: job_type,
      analysis_by: analysis_by,
      method: method,
      unit: unit,
      price: price,
      employee_id: employee_id
    })

    const result = await item.save()
    if (!result) {
      return res.status(500).json({
        message: "can not saved item"
      })
    }
    return res.status(200).json({ 
      status: true, 
      message: "เพิ่มวิธีการวิเคราะห์สำเร็จ", 
      data: result
    })
  } catch (err) {
    return res.status(500).json({ 
      message: err.message 
    })
  }
}

exports.createItems = async (req, res) => {
  const { data } = req.body
  try {
    const items = await ItemAnalysis.insertMany(data)
    return res.status(200).json({ 
      status: true, 
      message: "success!", 
      data: items
    })
  } catch (err) {
    return res.status(500).json({ 
      message: err.message 
    })
  }
}

exports.editItem = async (req, res) => {
  const { 
    name,
    tag,
    bottle_type,
    job_type,
    analysis_by,
    method,
    unit,
    price,
    employee_id,
    active
   } = req.body
  const { id } = req.params
  try {
    const analysis = await ItemAnalysis.findById(id)
    if (!analysis) {
      return res.status(404).json({ 
        message: "not found" 
      })
    }

    const data = {
      job_type: job_type || analysis.job_type,
      name: name || analysis.name,
      bottle_type: bottle_type || analysis.bottle_type,
      method: method || analysis.method,
      tag: tag || analysis.tag,
      unit: unit || analysis.unit,
      analysis_by: analysis_by || analysis.analysis_by,
      active: active || analysis.active,
      price: price || analysis.price,
      employee_id: employee_id || analysis.employee_id
    }

    const item = await ItemAnalysis.findByIdAndUpdate(id, data, { new : true })
    if(!item) {
      return res.status(500).json({
        message: "can not update item"
      })
    }

    return res.status(201).json({ 
      status: true, 
      message: "success!", 
      data: item
    })

  } catch (err) {
    return res.status(500).json({ 
      message: err.message 
    })
  }
}

exports.getItems = async (req, res) => {
  try {
    const analysis = await ItemAnalysis.find()
    return res.status(200).json({ 
      status: true, 
      message: `have ${analysis.length} items`, 
      data: analysis
    })
  } catch (error) {
      return res.status(500).json({ 
        status: false,
        message: err.message 
      })
  }
}

exports.getItem = async (req, res) => {
  const { id } = req.params
  try {
    const analysis = await ItemAnalysis.findById(id)
    if(!analysis) {
      return res.status(404).json({ 
        message: "not found"
      })
    }
    return res.status(200).json({ 
      status: true, 
      message: "success", 
      data: analysis
    })
  } catch (error) {
    return res.status(500).json({ 
      message: err.message 
    })
  }
}

exports.deleteItem = async (req, res) => {
  const { id } = req.params
  try {
    const item = await ItemAnalysis.findByIdAndDelete(id)
    if (!item) {
      return res.status(404).json({ 
        message: "not found" 
      })
    } else {
      return res.status(200).json({ 
        message: "success" 
      })
    }
  } catch (err) {
    return res.status(500).json({ 
      message: err.message
    })
  }
}

exports.deleteItems = async (req, res) => {
  try {
    const items = await ItemAnalysis.deleteMany()
    return res.status(200).json({ 
      status: true, 
      message: `deleted ${items.deletedCount} items`
    })
  } catch (err) {
    return res.status(500).json({ 
      message: err.message 
    })
  }
}