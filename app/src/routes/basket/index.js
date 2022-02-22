"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./basket.ctrl')

router.get('/api/app/create', ctrl.create.basketByApp) // http://happybuyer.co.kr/products/api/upload

router.get('/api/app/read', ctrl.read.basketByApp)

module.exports = router