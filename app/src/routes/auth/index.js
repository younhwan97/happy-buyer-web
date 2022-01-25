"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./auth.ctrl')

// View Rendering
router.get('/login', ctrl.view.login)

// Read Data
router.post('/login/login_process', ctrl.read.login_process)

// Remove Data
router.get('/logout', ctrl.remove.session)

module.exports = router