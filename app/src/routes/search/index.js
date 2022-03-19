"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./search.ctrl')

router.post('/recent-with-history', ctrl.search.createRecentWithHistory) // CREATE

router.get('/recent', ctrl.search.readRecent) // READ

router.get('/history', ctrl.search.readHistory) // READ

router.delete('/recent', ctrl.search.deleteRecent) // DELETE

module.exports = router