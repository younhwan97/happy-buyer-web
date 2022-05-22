"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./auth.ctrl')

// Rendering
router.get('/login', ctrl.view.login)

// API
router.post('/api/user', ctrl.user.create)

router.get('/api/user', ctrl.user.read)

router.put('/api/user', ctrl.user.update)



// Create Data
router.post('/login/login_process', ctrl.create.session)
router.get('/login/guest_login_process', ctrl.create.guest_session)


// Remove Data
router.get('/logout', ctrl.remove.session)

module.exports = router