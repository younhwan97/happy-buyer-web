"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./search.ctrl')

router.get('/recent', ctrl.read.recentSearchByApp) // READ

router.get('/history', ctrl.read.historyByApp) // READ

router.post('/recent', ctrl.create.recentSearchByApp) // CREATE

router.delete('/recent', ctrl.remove.recentSearchByApp) // DELETE

module.exports = router