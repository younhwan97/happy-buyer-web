"use strict";

/* Module */
const fs = require("fs")
const express = require("express")
const router = express.Router();
const mysql = require('mysql');
const conf = JSON.parse(fs.readFileSync('./config/database.json', 'utf-8')); // read db config file in server
const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

router.get('/api/order', (req, res) => {
    const orderId = req.query.id

    if(orderId){
        /* order ID 를 이용해 주문 정보를 확인한다. */
        let query = 'SELECT * FROM (order_history) WHERE order_id = ?'
        connection.query(query, orderId, (err, results, fields) => {
            const user = {
                'name' : results[0].name || "-",
                'shippingAddress': results[0].shipping_adress,
                'pointNumber': results[0].point_number || "-",
                'ds': results[0].status,
                'date': results[0].date
            }

            /* order ID 를 이용해 product ID 를 구한다. */
            query = 'SELECT product_id FROM (order_product_mapping) WHERE order_id = ?'
            connection.query(query, orderId, (err, results, fields) => {
                if (err) throw err;

                let productId = []

                for(let i = 0; i < results.length; i++)
                    productId.push(results[i].product_id)

                /* product ID 를 이용해 상품 정보를 확인한다. */
                query = 'SELECT * FROM (product) WHERE'

                for(let i= 0; i < productId.length; i++){
                    query = query+ ' product_id = ?'
                    if (i !== productId.length - 1){
                        query += ' OR'
                    }
                }

                connection.query(query, productId, (err, results, fields) => {
                    res.json({
                        status: 'success',
                        data: results,
                        user: user
                    })
                })
            })
        })
    } else {
        res.json({
            status: 'fail',
        })
    }
})

module.exports = router