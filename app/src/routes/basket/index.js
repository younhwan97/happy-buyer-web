"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./basket.ctrl')

router.post('/', ctrl.create.basketByApp) // CREATE

router.get('/', ctrl.read.basketByApp) // READ

router.put('/', ctrl.update.basketByApp) // UPDATE

router.delete('/', ctrl.remove.basketByApp) // DELETE

module.exports = router