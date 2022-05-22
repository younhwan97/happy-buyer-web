"use strict";

const event = {
    read: (req, res) => {
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        const pageNum = req.query.page || 1
        const sortBy = req.query.sort
        console.log(sortBy)
        if (pageNum < 1) {
            return res.json({
                success: false
            })
        }

        // 쿼리 생성 및 디비 요청
        let query = "SELECT * FROM event_product;"
        req.app.get('dbConnection').query(query, (err, results) => {
            if (err) throw err

            if (results.length === 0) { // 행사 상품이 없을 때
                return res.json({
                    success: false
                })
            }

            let eventProduct = results // 행사 삼품의 아이디와 행사 가격이 담긴 배열
            let eventProductId = [] // 행사 상품의 아이디가 담긴 배열

            for (let i = 0; i < eventProduct.length; i++) {
                eventProductId.push(eventProduct[i].product_id)
            }

            // 쿼리 생성
            query = "SELECT * FROM product WHERE status <> " + req.app.get('mysql').escape('삭제됨')
            query += " AND product_id IN (" + req.app.get('mysql').escape(eventProductId) + ")"

            if (sortBy) {
                if (sortBy === "판매순") {
                    query += " ORDER BY sales DESC"
                } else if (sortBy === "낮은 가격순") {
                    query += " ORDER BY price"
                } else if (sortBy === "높은 가격순") {
                    query += " ORDER BY price DESC"
                }
            }

            query += " LIMIT " + req.app.get('mysql').escape((pageNum - 1) * 10)
            query += ", 10;"

            req.app.get('dbConnection').query(query, (err, results) => {
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
