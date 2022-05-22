"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./event.ctrl')

// API
router.get('/api', ctrl.event.read)

module.exports = router