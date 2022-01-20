"use strict";

/* Module */
const express = require("express")
const router = express.Router()

const controller = require('./controller')

// View Rendering
router.get('/', controller.view.home)
router.get('/products', controller.view.products)
router.get('/addproduct', controller.view.addProduct)
router.get('/dashboard', controller.view.dashboard)

// Read Data
router.get('/api/order', controller.read.order)

// Create&Upload Data
router.post('/api/upload', controller.create.s3)
router.post('/api/addproduct', controller.create.product)

// Remove Data
router.post('/api/product/remove', controller.remove.product)

module.exports = router;