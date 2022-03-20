"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./wished.ctrl')

// CREATE DELETE, http://happybuyer.co.kr/wished/api
router.post('/api', ctrl.wished.createOrDelete)

// READ, http://happybuyer.co.kr/wished/api
router.get('/api', ctrl.wished.read)

module.exports = router