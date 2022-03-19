"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./wished.ctrl')

router.post('/', ctrl.create.wishedByApp) // CREATE

router.get('/', ctrl.read.wishedByApp) // READ

module.exports = router