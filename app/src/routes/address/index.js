"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./address.ctrl')

// CREATE, http://happybuyer.co.kr/address/api
router.post('/api', ctrl.address.create)

// UPDATE, http://happybuyer.co.kr/address/api
router.put('/api', ctrl.address.update)

module.exports = router