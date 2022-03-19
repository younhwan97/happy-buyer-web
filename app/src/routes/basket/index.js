"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./basket.ctrl')

router.post('/', ctrl.basket.createOrUpdate) // CREATE or UPDATE

router.get('/', ctrl.basket.read) // READ

router.put('/', ctrl.basket.update) // UPDATE

router.delete('/', ctrl.basket.delete) // DELETE

module.exports = router