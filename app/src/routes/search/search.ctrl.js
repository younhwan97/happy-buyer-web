"use strict";

const read = {
    recentSearchByApp : (req, res) => {
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        const userId = req.query.id

        const query = "SELECT * FROM recent_search WHERE user_id = ?;"
        req.app.get('dbConnection').query(query, userId, (err, results) => {
            if(err) throw err

            return res.json({
                success: true,
                data: results
            })
        })
    },

    historyByApp : (req, res) => {
        let query= "SELECT * FROM search_history ORDER BY count DESC LIMIT 300;"
        req.app.get('dbConnection').query(query, (err, results) => {
            if (err) throw err

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

const create = {
    recentSearchByApp : (req, res) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }
        
        const userId = req.body.id
        const keyword = req.body.keyword

        const query = 'INSERT INTO recent_search (user_id, keyword) VALUES (?, ?);'
        req.app.get('dbConnection').query(query, [userId, keyword], (err) => {
            if(err) throw err

            return res.json({
                success: true
            })
        })
    }
}

const remove = {
    recentSearchByApp : (req, res) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        const userId = req.body.id
        const keyword = req.body.keyword

        let query = "DELETE FROM recent_search WHERE user_id = " + req.app.get('mysql').escape(userId)

        if(keyword !== null && keyword !== undefined){
            query += " AND keyword = " + req.app.get('mysql').escape(keyword)
        }

        query += ';'

        req.app.get('dbConnection').query(query, (err) => {
            if (err) throw err

            return res.json({
                success: true
            })
        })
    }
}

module.exports = {
    read,
    create,
    remove
}
