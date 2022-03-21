"use strict";

const basket = {
    createOrUpdate : (req, res) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        const userId = req.body.user_id || -1
        const productId = req.body.product_id
        let count = req.body.count

        if(userId === -1){ // 로그인 정보가 없는 유저
            return res.json({
                success: false
            })
        }

        let query = "SELECT * FROM basket WHERE user_id = ? AND product_id = ?;"
        req.app.get('dbConnection').query(query, [userId, productId], (err, results) => {
            if (err) throw err

            if(results.length !== 0){
                count += results[0].count

                if(count > 20) count = 20

                query = "UPDATE basket set count = " + req.app.get('mysql').escape(count)
                query += " WHERE user_id = " + req.app.get('mysql').escape(userId)
                query += " AND product_id = " + req.app.get('mysql').escape(productId)
                query += ';'

                req.app.get('dbConnection').query(query, (err) => {
                    if(err) throw err

                    return res.json({
                        success: true,
                        result_count: count
                    })
                })
            } else {
                query = 'INSERT INTO basket(user_id, product_id, count) VALUES(?, ?, ?);'
                req.app.get('dbConnection').query(query, [userId, productId, count], (err) => {
                    if(err) throw err

                    res.json({
                        success: true,
                        result_count: count
                    })
                })
            }
        })
    },

    read : (req, res) => {
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        const userId = req.query.id || -1

        if(userId === -1){ // 로그인 정보가 없는 유저
            return res.json({
                success: false
            })
        }

        // 유저의 아이디를 이용해 장바구니에 담긴 상품의 정보(아이디, 카운트)를 가져온다.
        let query = "SELECT product_id, count FROM basket WHERE user_id = ?;"
        req.app.get('dbConnection').query(query, [userId], (err, results) => {
            if(err) throw err

            if(results.length === 0){ // 유저의 장바구니가 비어있을 때
                return res.json({
                    success: false
                })
            }

            let basketProduct = results // 장바구니에 들어있는 상품 배열
            let basketProductId = [] // 장바구니에 들어있는 상품의 아이디 배열
            for(let i = 0; i < basketProduct.length; i++){
                basketProductId.push(basketProduct[i].product_id)
            }

            // 장바구니에 담긴 상품의 아이디를 이용해 상품의 나머지 정보(이미지, 가격 ..)를 가져온다.
            query = "SELECT * FROM product WHERE status <> ? AND product_id IN (?);"
            req.app.get('dbConnection').query(query, ['삭제됨', basketProductId], (err, results) => {
                if(err) throw err

                for(let i = 0; i < basketProduct.length; i++){
                    for(let j = 0; j < results.length; j++){
                        if(basketProduct[i].product_id === results[j].product_id){
                            results[j].count_in_basket = basketProduct[i].count
                            basketProduct[i] = results[j]
                            break
                        }
                    }
                }

                // 장바구니에 담긴 상품의 아이디를 이용해 상품의 할인 정보를 가져온다.
                query = "SELECT * FROM event_product WHERE product_id IN (?);"
                req.app.get('dbConnection').query(query, [basketProductId], (err, results) => {
                    if(err) throw err

                    for(let i = 0; i < basketProduct.length; i++){
                        for(let j = 0; j < results.length; j++){
                            if(basketProduct[i].product_id === results[j].product_id){
                                basketProduct[i].on_sale = true
                                basketProduct[i].event_price = results[j].event_price
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
        })
    },

    update: (req, res) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        const userId = req.body.user_id || -1
        const productId = req.body.product_id
        const perform = req.body.perform

        if(userId === -1){ // 로그인 정보가 없는 유저
            return res.json({
                success: false
            })
        }

        if(perform === "minus"){
            const query = "UPDATE basket set count = count - ? WHERE user_id = ? AND product_id = ?;"
            req.app.get('dbConnection').query(query, [1, userId, productId], (err) => {
                if(err) throw err

                return res.json({
                    success: true
                })
            })
        } else {
            return res.json({
                success: false
            })
        }
    },

    delete: (req, res) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        const reqBody = req.body
        const userId = reqBody[0].user_id || -1
        const productId = []

        if(userId === -1){ // 로그인 정보가 없는 유저
            return res.json({
                success: false
            })
        }

        for(let i = 0; i < reqBody.length; i++){
            if(reqBody[i].user_id === userId){
                productId.push(reqBody[i].product_id)
            }
        }

        const query = "DELETE FROM basket WHERE user_id = ? AND product_id IN (?);"
        req.app.get('dbConnection').query(query, [userId, productId], (err)=>{
            if(err) throw err

            res.json({
                success: true
            })
        })
    }
}

module.exports = { basket }
