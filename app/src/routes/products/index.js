"use strict";

// Module
const express = require("express")
const router = express.Router()
const ctrl = require('./products.ctrl')

// Rendering
router.get('/', ctrl.products.view) // READ, http://happybuyer.co.kr/products, USING BY WEB

router.get('/add', ctrl.add_products.view)

// API
router.post('/api', ctrl.products.create)

router.post('/api/s3', ctrl.s3.create)

router.get('/api', ctrl.products.read)

router.delete('/api', ctrl.products.delete)

module.exports = router