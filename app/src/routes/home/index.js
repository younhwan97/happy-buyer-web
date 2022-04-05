"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./home.ctrl')

router.post("/api", ctrl.order.create)

router.get("/api", ctrl.order.read)

router.get("/api/products", ctrl.products.read)




// View Rendering
router.get('/', ctrl.view.home)

// Read Data
router.get('/api/read/order', ctrl.read.order)

// Update Data
router.get('/api/update/order', ctrl.update.order)

// Remove Data
router.delete('/api/remove/order', ctrl.remove.order)

module.exports = router