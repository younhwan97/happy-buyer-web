"use strict";

const fs = require('fs')

const read = {
    wishedByApp : (req, res) => {
        let kakaoAccountId
        let query

        if (!req.query || Object.keys(req.query).length === 0) { // 상품 데이터가 없을 때
            return res.json({
                success: false
            })
        }


        kakaoAccountId = req.query.id
        query = 'SELECT * FROM wished WHERE user_id = ?;'

        req.app.get('dbConnection').query(query, [kakaoAccountId], (err, results, fields) => {
            return res.json({
                success: true,
                data: results
            })
        })
    }
}

const create = {
    wishedByApp : (req, res) => {
        let kakaoAccountId
        let productId
        let query

        if (!req.query || Object.keys(req.query).length === 0) { // 상품 데이터가 없을 때
            return res.json({
                success: false
            })
        }

        kakaoAccountId = req.query.uid
        productId = req.query.pid

        query = 'SELECT * FROM wished WHERE user_id = ? AND product_id = ?;'
        req.app.get('dbConnection').query(query, [kakaoAccountId, productId], (err, results, fields) => {
            if(err) throw err

            if(results.length === 0){
                query = 'INSERT INTO wished (user_id, product_id) VALUES(?, ?);'
                req.app.get('dbConnection').query(query, [kakaoAccountId, productId], (err, results, fields) => {
                    if(err) throw err

                    return res.json({
                        success: true
                    })
                })
            } else {
                query = 'DELETE FROM wished WHERE user_id = ? AND product_id = ?;'
                req.app.get('dbConnection').query(query, [kakaoAccountId, productId], (err, results, fields) => {
                    if(err) throw err

                    return res.json({
                        success: true
                    })
                })
            }
        })
    }
}

module.exports = {
    read,
    create
}
