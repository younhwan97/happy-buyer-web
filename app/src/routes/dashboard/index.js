"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./dashboard.ctrl')

// View Rendering
router.get('/', ctrl.view.dashboard)

module.exports = router