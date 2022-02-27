"use strict";

const read = {
    eventByApp : (req, res) => {
        let query = 'SELECT * FROM event_product;'

        req.app.get('dbConnection').query(query, (err, results, fields) => {
            if (err) throw err

            if(results.length !== 0){ // 이벤트 상품이 있을 때
                let eventProductIdAndPrice = results
                let eventProductId = []

                for(let i = 0; i<eventProductIdAndPrice.length; i++)
                    eventProductId.push(eventProductIdAndPrice[i].product_id)

                let query = 'SELECT * FROM product WHERE status <> ? AND product_id IN (?);'
                req.app.get('dbConnection').query(query, ['삭제됨', eventProductId], (err, results, fields)=>{
                    if(err) throw err

                    for(let i = 0; i < results.length; i++){
                        for(let j = 0; j < eventProductIdAndPrice.length; j++){
                            if(results[i].product_id === eventProductIdAndPrice[j].product_id){
                                results[i].event_price = eventProductIdAndPrice[j].event_price
                                break;
                            }
                        }
                    }

                    return res.json({
                        success: true,
                        data: results
                    })
                })
            } else { // 이벤트 상품이 없을 때
                return res.json({
                    success: false
                })
            }
        })
    }
}


module.exports = {
    read
}
