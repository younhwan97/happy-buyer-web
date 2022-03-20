"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./search.ctrl')

// CREATE, http://happybuyer.co.kr/search/api/recent-with-history
router.post('/api/recent-with-history', ctrl.search.createRecentWithHistory)

// READ, http://happybuyer.co.kr/search/api/recent
router.get('/api/recent', ctrl.search.readRecent)

// READ, http://happybuyer.co.kr/search/api/history
router.get('/api/history', ctrl.search.readHistory)

// DELETE, http://happybuyer.co.kr/search/api/recent
router.delete('/api/recent', ctrl.search.deleteRecent)

module.exports = router