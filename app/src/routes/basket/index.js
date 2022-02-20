"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./products.ctrl')

// Create&Upload Data
router.post('/api/app/crate', ctrl.create.s3) // http://happybuyer.co.kr/products/api/upload


module.exports = router