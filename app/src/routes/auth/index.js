"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./auth.ctrl')

// View Rendering
router.get('/login', ctrl.view.login)
router.get('/logout', ctrl.view.logout)

// Read Data
router.post('/login/login_process', ctrl.read.login_process)

module.exports = router