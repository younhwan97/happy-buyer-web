"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./basket.ctrl')

router.get('/api/app/create', ctrl.create.basketByApp)

router.get('/api/app/read', ctrl.read.basketByApp)

router.get('/api/app/update', ctrl.update.basketByApp)

module.exports = router