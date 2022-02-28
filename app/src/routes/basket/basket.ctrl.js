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
        query = 'SELECT * FROM basket WHERE user_id = ? AND product_id = ?;'

        req.app.get('dbConnection').query(query, [kakaoAccountId, productId], (err, results, fields) => {
            if (err) throw err

            if(results.length !== 0){
                query = 'UPDATE basket set count = count + ? WHERE user_id = ? AND product_id = ?;'

                req.app.get('dbConnection').query(query, [1, kakaoAccountId, productId], (err, results, fields)=>{

                    res.json({
                        success: true
                    })
                })
            } else{
                query = 'INSERT INTO basket(user_id, product_id, count) VALUES(?, ?, ?);'

                console.log(kakaoAccountId)
                console.log(productId)

                req.app.get('dbConnection').query(query, [kakaoAccountId, productId, 1], (err, results, fields)=>{

                    res.json({
                        success: true
                    })
                })
            }
        })
    }
}

const read = {
    basketByApp : (req, res) => {
        let kakaoAccountId
        let query

        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        kakaoAccountId = req.query.id
        query = 'SELECT product_id, count FROM basket WHERE user_id =?;'

        req.app.get('dbConnection').query(query, [kakaoAccountId], (err, results, fields) => {

            let basketProductIdAndCount = results
            let basketProductId = []
            for(let i = 0; i < basketProduct.length; i++){
                basketProductId.push(basketProduct[i].product_id)
            }

            query = 'SELECT * FROM product WHERE status <> ? AND product_id IN (?);'

            req.app.get('dbConnection').query(query, ['삭제됨', basketProductId], (err, results) =>{
                if(err) throw err

                let basketProduct = []

                for(let i = 0; i < basketProductIdAndCount.length; i++){
                    for(let j = 0; j < results.length; j++){
                        if(basketProductIdAndCount[i].product_id === results[j].product_id){
                            results[j].count_in_basket = basketProductIdAndCount[i].count
                            basketProduct.push(results[j])
                            break
                        }
                    }
                }

                return res.json({
                    success: true,
                    data: basketProduct
                })
            })
        })
    }
}


module.exports = {
    create,
    read
}
