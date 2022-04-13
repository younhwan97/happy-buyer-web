"use strict";

// Module
const express = require("express")
const router = express.Router()
const ctrl = require('./products.ctrl')

// Rendering
router.get('/', ctrl.products.view) // READ, http://happybuyer.co.kr/products, USING BY WEB

router.get('/add', ctrl.add_products.view)

// API
router.get('/api', ctrl.products.read)

router.delete('/api', ctrl.products.delete)



// Create&Upload Data
router.post('/api/upload', ctrl.create.s3)
router.post('/api/add', ctrl.create.product)


module.exports = router