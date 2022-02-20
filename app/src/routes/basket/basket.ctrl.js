"use strict";

const fs = require('fs')

const create = {
    basketByApp : (req, res) => {
        let productId
        let kakaoAccountId
        let query

        if (!req.query || Object.keys(req.query).length === 0) { // 상품 데이터가 없을 때
            return res.json({
                success: false
            })
        }

        productId = req.query.pid
        kakaoAccountId = req.query.uid
        query = 'SELECT * FROM basket WHERE used_id = ? AND product_id = ?;'
        req.app.get('dbConnection').query(query, [kakaoAccountId, productId], (err, results, fields) => {
            if (err) throw err

            if(results.length !== 0){
                query = 'UPDATE basket set count = count + 1 WHERE used_id = ? AND product_id = ?;'

                req.app.get('dbConnection').query(query, [kakaoAccountId, productId], (err, results, fields)=>{

                    res.json({
                        success: true
                    })
                })
            } else{
                query = 'INSERT INTO basket(user_id, product_id, count) VALUES (?, ?, ?);'

                req.app.get('dbConnection').query(query, [kakaoAccountId, productId, 1], (err, results, fields)=>{

                    res.json({
                        success: true
                    })
                })
            }
        })
    }
}

module.exports = {
    create,
}
