"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./event.ctrl')

// READ, http://happybuyer.co.kr/event/api
router.get('/api', ctrl.event.read)

module.exports = router