"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./basket.ctrl')

// Create&Upload Data
router.get('/api/app/create', ctrl.create.basketByApp) // http://happybuyer.co.kr/products/api/upload


module.exports = router