"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const ctrl = require('./products.ctrl')

// View Rendering
router.get('/', ctrl.view.products)
router.get('/add', ctrl.view.addProduct) // http://happybuyer.co.kr/products/add

// Create&Upload Data
router.post('/api/upload', ctrl.create.s3) // http://happybuyer.co.kr/products/api/upload
router.post('/api/add', ctrl.create.product) // http://happybuyer.co.kr/products/api/add

// Read Data
router.get('/api/app/reads', ctrl.read.productsByApp)
router.get('/api/app/read', ctrl.read.productByApp)

// Remove Data
router.post('/api/remove', ctrl.remove.product) // http://happybuyer.co.kr/products/api/remove

module.exports = router