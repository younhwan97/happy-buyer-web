"use strict";

const event = {
    read: (req, res) => {
        // 쿼리 생성 및 디비 요청
        let query = "SELECT * FROM event_product;"
        req.app.get('dbConnection').query(query, (err, results) => {
            if (err) throw err

            if (!results.length) { // 행사 상품이 없을 때
                return res.json({
                    success: false
                })
            }

            let eventProduct = results // 행사 삼품의 아이디와 행사 가격이 담긴 배열
            let eventProductId = [] // 행사 상품의 아이디가 담긴 배열

            for (let i = 0; i < eventProduct.length; i++) {
                eventProductId.push(eventProduct[i].product_id)
            }

            query = "SELECT * FROM product WHERE status <> ? AND product_id IN (?);" // 상품의 아이디를 이용해 나머지 정보를 조회
            req.app.get('dbConnection').query(query, ['삭제됨', eventProductId], (err, results) => {
                if (err) throw err

                for (let i = 0; i < results.length; i++) {
                    for (let j = 0; j < eventProduct.length; j++) {
                        if (results[i].product_id === eventProduct[j].product_id) {
                            results[i].on_sale = true
                            results[i].event_price = eventProduct[j].event_price
                            break
                        }
                    }
                }

                return res.json({
                    success: true,
                    data: results
                })
            })
        })
    }
}

module.exports = {event}
