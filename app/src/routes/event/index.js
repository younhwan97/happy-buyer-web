"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./event.ctrl')

router.get('/api/app/read', ctrl.read.eventByApp)

module.exports = router