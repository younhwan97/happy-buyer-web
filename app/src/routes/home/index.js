"use strict";

// Module
const express = require("express")
const router = express.Router()
const ctrl = require('./home.ctrl')

/* API Level */
// CREATE, http://happybuyer.co.kr/api
router.post("/api", ctrl.order.create)

// READ, http://happybuyer.co.kr/api
router.get("/api", ctrl.order.read)

// READ, http://happybuyer.co.kr/api/products
router.get("/api/products", ctrl.products.read)

// UPDATE, http://happybuyer.co.kr/api
router.put('/api', ctrl.order.update)

// DELETE, http://happybuyer.co.kr/api
router.delete('/api', ctrl.order.delete)

/* View Rendering Level */
// READ, http://happybuyer.co.kr
router.get('/', ctrl.order.view)

// READ, http://happybuyer.co.kr/order-detail
router.get('/order-detail', ctrl.order_detail.view)

module.exports = router