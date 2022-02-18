"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./auth.ctrl')

// View Rendering
router.get('/login', ctrl.view.login)

// Create Data
router.post('/login/login_process', ctrl.create.session)
router.get('/login/guest_login_process', ctrl.create.guest_session)
router.get('/api/app/create', ctrl.create.userByApp)

// Remove Data
router.get('/logout', ctrl.remove.session)

// Update Data
router.get('/api/app/update', ctrl.update.userByApp)

// Read Data
router.get('/api/app/read', ctrl.read.userByApp)

module.exports = router