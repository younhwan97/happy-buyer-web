"use strict";

const read = {
    recentSearchByApp : (req, res) => {
        let kakaoAccountId
        let query

        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        kakaoAccountId = req.query.id
        query = 'SELECT * FROM recent_search WHERE user_id = ?;'

        req.app.get('dbConnection').query(query, kakaoAccountId, (err, results) => {
            if(err) throw err

            return res.json({
                success: true,
                data: results
            })
        })

    }
}

const create = {
    searchByApp : (req, res) => {
        let kakaoAccountId
        let keyword
        let query

        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        kakaoAccountId = req.query.id
        keyword = req.query.keyword

        query = 'SELECT * FROM recent_search WHERE user_id = ? AND keyword = ?;'
        req.app.get('dbConnection').query(query, [kakaoAccountId, keyword], (err, results) => {
            if(err) throw err

            if(results.length !== 0){
                return res.json({
                    success: true
                })
            }

            query = 'INSERT INTO recent_search (user_id, keyword) VALUES (?, ?);'
            req.app.get('dbConnection').query(query, [kakaoAccountId, keyword], (err, results) => {
                if(err) throw err

                return res.json({
                    success: true
                })
            })
        })
    }
}

module.exports = {
    read,
    create
}