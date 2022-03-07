"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./search.ctrl')

router.get('/api/app/recent/read', ctrl.read.recentSearchByApp)

router.get('/api/app/recent/create', ctrl.create.recentSearchByApp)

router.get('/api/app/recent/delete', ctrl.remove.recentSearchByApp)


module.exports = router