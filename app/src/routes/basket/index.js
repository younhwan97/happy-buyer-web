"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./basket.ctrl')

router.get('/', ctrl.read.basketByApp)

router.post('/', ctrl.create.basketByApp)

router.put('/', ctrl.update.basketByApp)

router.delete('/', ctrl.remove.basketByApp)

module.exports = router