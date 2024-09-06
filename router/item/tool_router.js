const Tool = require("../../controllers/item/tool.controllers")
const router = require('express').Router()
const AuthAdmin = require('../../lib/auth-admin')
const AuthEmployee = require('../../lib/auth-employee')

// tool
router.post("/tools", Tool.createTools)
router.post("/tool", Tool.createTool)
router.put("/tool/:id", Tool.updateTool)
router.get("/tools", Tool.getTools)
router.get("/tool/:id", Tool.getTool)
router.delete("/tool/:id", Tool.deleteTool)

// tool picture
router.post("/tool-picture", Tool.createToolPicture)
router.get("/tool-picture/:tool_id", Tool.getToolPicture)

// tool log
router.post("/tool-log", Tool.insertToolLog)
router.put("/tool-log/:id", Tool.updateToolLog)
router.get("/tool-logs", Tool.getToolLogs)
router.delete("/tool-log/:id", Tool.deleteToolLog)

// tool type
router.post("/tool-type", Tool.createToolType)
router.put("/tool-type/:id", Tool.updateToolType)
router.get("/tool-types", Tool.getToolTypes)
router.delete("/tool-type/:id", Tool.deleteToolType)

// tool standard
router.post("/tool-standard", Tool.createToolStandard)
router.put("/tool-standard/:id", Tool.updateToolStandard)
router.get("/tool-standards", Tool.getToolStandards)
router.delete("/tool-standard/:id", Tool.deleteToolStandard)

// tool register
router.post("/tool-register", Tool.createToolRegisterStatus)
router.put("/tool-register/:id", Tool.updateToolRegisterStatus)
router.get("/tool-registers", Tool.getToolRegisterStatuses)
router.delete("/tool-register/:id", Tool.deleteToolRegisterStatus)

// tool calibrate
router.post("/tool-calibrate", Tool.createToolCalibrateStatus)
router.put("/tool-calibrate/:id", Tool.updateToolCalibrateStatus)
router.get("/tool-calibrates", Tool.getToolCalibrateStatuses)
router.delete("/tool-calibrate/:id", Tool.deleteToolCalibrateStatus)

// tool certificate
router.post("/tool-certificate", Tool.createToolCertificateStatus)
router.put("/tool-certificate/:id", Tool.updateToolCertificateStatus)
router.get("/tool-certificates", Tool.getToolCertificateStatuses)
router.delete("/tool-certificate/:id", Tool.deleteToolCertificateStatus)

module.exports = router