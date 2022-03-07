"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./search.ctrl')

router.get('/api/app/recent', ctrl.read.recentSearchByApp)

router.get('/api/app/create', ctrl.create.searchByApp)

module.exports = router