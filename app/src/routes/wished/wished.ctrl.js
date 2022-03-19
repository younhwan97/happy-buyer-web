"use strict";

const wished = {
    createOrDelete : (req, res) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        const userId = req.body.uid
        const productId = req.body.pid

        let query = 'SELECT * FROM wished WHERE user_id = ? AND product_id = ?;'
        req.app.get('dbConnection').query(query, [userId, productId], (err, results) => {
            if(err) throw err

            if(results.length){
                query = 'DELETE FROM wished WHERE user_id = ? AND product_id = ?;'
                req.app.get('dbConnection').query(query, [userId, productId], (err) => {
                    if(err) throw err

                    return res.json({
                        success: true,
                        perform: 'delete'
                    })
                })
            } else {
                query = 'INSERT INTO wished (user_id, product_id) VALUES(?, ?);'
                req.app.get('dbConnection').query(query, [userId, productId], (err) => {
                    if(err) throw err

                    return res.json({
                        success: true,
                        perform: 'create'
                    })
                })
            }
        })
    },

    read: (req, res) => {
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        const userId = req.query.id

        const query = "SELECT * FROM wished WHERE user_id = ?;"
        req.app.get('dbConnection').query(query, [userId], (err, results) => {
            if(err) throw err

            if(results.length){
                return res.json({
                    success: true,
                    data: results
                })
            } else {
                return res.json({
                    success: false
                })
            }
        })
    }
}

module.exports = { wished }
