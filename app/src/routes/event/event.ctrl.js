"use strict";

const fs = require('fs')

const read = {
    basketByApp : (req, res) => {
        let query = 'SELECT * FROM event_product;'

        req.app.get('dbConnection').query(query, (err, results, fields) => {
            if (err) throw err

            if(results.length !==0){
                let eventProductIdAndPrice = results

                let query = 'SELECT * FROM product;'
                req.app.get('dbConnection').query(query, (err, results, fields) => {
                    if (err) throw err

                    if(results.length !== 0){
                        let eventProduct = []

                        for(let i = 0; i < results.length; i++){
                            for(let j = 0; j < eventProductIdAndPrice.length; j++){
                                if(results[i].product_id === eventProductIdAndPrice[j].product_id){
                                    results[i].event_price = eventProductIdAndPrice[j].event_price
                                    eventProduct.push(results[i])
                                    break;
                                }
                            }
                        }
                        return res.json({
                            success: true,
                            data: eventProduct
                        })
                    } else {
                        return res.json({
                            success: false
                        })
                    }
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
