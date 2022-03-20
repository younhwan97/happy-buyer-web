"use strict";

const express = require("express")
const router = express.Router()
const ctrl = require('./basket.ctrl')

// CREATE UPDATE, http://happybuyer.co.kr/basket/api
router.post('/api', ctrl.basket.createOrUpdate)

// READ, http://happybuyer.co.kr/basket/api
router.get('/api', ctrl.basket.read)

// UPDATE, http://happybuyer.co.kr/basket/api
router.put('/api', ctrl.basket.update)

// DELETE, http://happybuyer.co.kr/basket/api
router.delete('/api', ctrl.basket.delete)

module.exports = router