"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./wished.ctrl')

router.post('/', ctrl.wished.createOrDelete) // CREATE or DELETE

router.get('/', ctrl.wished.read) // READ

module.exports = router