"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./wished.ctrl')

router.get('/api/app/read', ctrl.read.wishedByApp) // http://happybuyer.co.kr/products/api/upload

router.get('/api/app/create', ctrl.create.wishedByApp)


module.exports = router