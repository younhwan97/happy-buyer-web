"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./event.ctrl')

router.get('/', ctrl.event.read)

module.exports = router