"use strict";

const fs = require('fs')

const read = {
    eventByApp : (req, res) => {
        let query = 'SELECT * FROM event_product;'

        req.app.get('dbConnection').query(query, (err, results, fields) => {
            if (err) throw err

            if(results.length !== 0){
                let eventProductIdAndPrice = results
                let eventProductId = []

                for(let i = 0; i<eventProductIdAndPrice.length; i++){
                    eventProductId.push(eventProductIdAndPrice[i].product_id)
                }

                let query = 'SELECT * FROM product WHERE product_id IN (?)'
                req.app.get('dbConnection').query(query, [eventProductId], (err, results, fields)=>{
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
            } else {
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
