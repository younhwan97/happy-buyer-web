"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./home.ctrl')

// View Rendering
router.get('/', ctrl.view.home)

// Read Data
router.get('/api/read/order', ctrl.read.order)

// Update Data
router.get('/api/update/order', ctrl.update.order)

// Remove Data
router.delete('/api/remove/order', ctrl.remove.order)

module.exports = router