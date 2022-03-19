"use strict";

const event = {
    read : (req, res) => {
        let query = "SELECT * FROM event_product;"

        req.app.get('dbConnection').query(query, (err, results) => {
            if (err) throw err

            if(!results.length){ // 행사 상품이 없을 때
                return res.json({
                    success: false
                })
            }

            let eventProduct = results
            let eventProductId = []

            for(let i = 0; i<eventProduct.length; i++){
                eventProductId.push(eventProduct[i].product_id)
            }

            query = "SELECT * FROM product WHERE status <> ? AND product_id IN (?);"
            req.app.get('dbConnection').query(query, ['삭제됨', eventProductId], (err, results)=>{
                if(err) throw err

                for(let i = 0; i < results.length; i++){
                    for(let j = 0; j < eventProduct.length; j++){
                        if(results[i].product_id === eventProduct[j].product_id){
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

module.exports = { event }
