"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./address.ctrl')

// CREATE, http://happybuyer.co.kr/address/api
router.post('/api', ctrl.address.create)

// READ, http://happybuyer.co.kr/address/api
router.get('/api', ctrl.address.read)

// UPDATE, http://happybuyer.co.kr/address/api
router.put('/api', ctrl.address.update)

// DELETE, http://happybuyer.co.kr/address/api
router.delete('/api', ctrl.address.delete)

module.exports = router