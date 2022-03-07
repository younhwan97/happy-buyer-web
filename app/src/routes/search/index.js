"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./search.ctrl')

router.get('/api/app/recent', ctrl.read.recentSearchByApp)

module.exports = router