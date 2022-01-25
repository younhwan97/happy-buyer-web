"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./auth.ctrl')

// View Rendering
router.get('/login', ctrl.view.login)

module.exports = router