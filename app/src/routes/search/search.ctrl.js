"use strict";

const search = {
    createRecentWithHistory: (req, res) => {
        // 리퀘스트 바디가 비어있는 경우 바로 종료
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        // 리퀘스트 바디로부터 값을 얻어 온다.
        let userId = req.body.id || -1
        let keyword = req.body.keyword

        // 타입 체크
        if (typeof userId !== "number") {
            userId = Number(userId)
        }

        if (typeof keyword === "string") {
            keyword = keyword.trim()
        }

        // 유저 아이디가 -1인 경우 바로 종료
        if (userId === -1) {
            return res.json({
                success: false
            })
        }

        // 키워드가 존재하지 않거나 잘못된 키워드가 전달된 경우 바로 종료
        if (keyword === null || keyword === undefined || keyword === "null" || keyword === "undefined") {
            return res.json({
                success: false
            })
        }

        // 쿼리 생성 및 디비 요청
        let query = "INSERT INTO recent_search (user_id, keyword) VALUES (?, ?);" // 최근 검색 테이블에 유저 아이디와 키워드를 추가
        req.app.get('dbConnection').query(query, [userId, keyword], (err) => {
            if (err) throw err

            query = "SELECT * FROM search_history WHERE keyword = ?;" // 검색 히스토리 테이블에 해당 키워드가 존재하는지 조회
            req.app.get('dbConnection').query(query, keyword, (err, results) => {
                if (err) throw err

                if (results.length !== 0) { // 검색 히스토리 테이블에 이미 키워드가 존재할 경우
                    query = "UPDATE search_history SET count = count + ? WHERE keyword = ?;" // 카운트를 1 증가
                    req.app.get('dbConnection').query(query, [1, keyword], (err) => {
                        if (err) throw err

                        return res.json({
                            success: true
                        })
                    })
                } else { // 겸색 히스토리 테이블에 키워드가 존재하지 않을 경우
                    query = "INSERT INTO search_history (keyword, count) VALUES (?, ?);" // 키워드를 갖는 행을 추가
                    req.app.get('dbConnection').query(query, [keyword, 1], (err) => {
                        if (err) throw err

                        return res.json({
                            success: true
                        })
                    })
                }
            })
        })
    },

    readRecent: (req, res) => {
        // 쿼리스트링이 비어있는 경우 바로 종료
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        // 쿼리 스트링으로 부터 값을 얻어 온다.
        let userId = req.query.id || -1

        // 타입 체크
        if (typeof userId !== "number") {
            userId = Number(userId)
        }

        // 유저 아이디가 -1인 경우 바로 종료
        if (userId === -1) {
            return res.json({
                success: false
            })
        }

        // 쿼리 생성 및 디비 요청
        const query = "SELECT * FROM recent_search WHERE user_id = ?;" // 최근 검색어를 조회
        req.app.get('dbConnection').query(query, userId, (err, results) => {
            if (err) throw err

            return res.json({
                success: true,
                data: results
            })
        })
    },

    readHistory: (req, res) => {
        // 쿼리 생성 및 디비 요청
        const query = "SELECT * FROM search_history ORDER BY count DESC LIMIT 300;" // 카운트 값을 기준으로 검색 히스토리 테이블을 조회
        req.app.get('dbConnection').query(query, (err, results) => {
            if (err) throw err

            return res.json({
                success: true,
                data: results
            })
        })
    },

    deleteRecent: (req, res) => {
        // 리퀘스트 바디가 비어있는 경우 바로 종료
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        // 리퀘스트 바디로 부터 값을 얻어 온다.
        let userId = req.body.id || -1
        let keyword = req.body.keyword

        // 타입 체크
        if (typeof userId !== "number") {
            userId = Number(userId)
        }

        // 유저 아이디가 -1인 경우 바로 종료
        if (userId === -1) {
            return res.json({
                success: false
            })
        }

        // 쿼리 생성
        let query = "DELETE FROM recent_search WHERE user_id = " + req.app.get('mysql').escape(userId)

        if (keyword !== null && keyword !== undefined && keyword !== "null" && keyword !== "undefined") {
            query += " AND keyword = " + req.app.get('mysql').escape(keyword)
        }

        query += ';'

        // 쿼리 요청
        req.app.get('dbConnection').query(query, (err) => {
            if (err) throw err

            return res.json({
                success: true
            })
        })
    }
}


module.exports = {search}
