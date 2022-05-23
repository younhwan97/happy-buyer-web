"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./policy.ctrl')

router.get('/', ctrl.policy.view)

module.exports = router