"use strict";

// Module
const express = require("express")
const router = express.Router()
const ctrl = require('./home.ctrl')

// Rendering
router.get('/', ctrl.order.view) // READ, http://happybuyer.co.kr, USING BY WEB

// API
router.post("/api", ctrl.order.create) // CREATE, http://happybuyer.co.kr/api, USING BY APP

router.get("/api", ctrl.order.read) // READ, http://happybuyer.co.kr/api, USING BY APP

router.put('/api', ctrl.order.update) // UPDATE, http://happybuyer.co.kr/api, USING BY WEB

router.delete('/api', ctrl.order.delete) // DELETE, http://happybuyer.co.kr/api, USING BY WEB

router.get('/api/detail', ctrl.order_detail.read) // READ, http://happybuyer.co.kr/api/detail, USING BY WEB

router.get("/api/products", ctrl.order_products.read) // READ, http://happybuyer.co.kr/api/products, USING BY APP

module.exports = router