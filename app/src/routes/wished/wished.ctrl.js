"use strict";

const wished = {
    createOrDelete: (req, res) => {
        // 리퀘스트 바디가 비어있는 경우 바로 종료
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        // 리퀘스트 바디로 부터 값을 얻어온다.
        let userId = req.body.uid || -1
        let productId = req.body.pid

        // 타입체크
        if (typeof userId !== "number") {
            userId = Number(userId)
        }

        if (typeof productId !== "number") {
            productId = Number(productId)
        }

        // 유저 아이디가 -1인 경우 바로 종료
        if (userId === -1) {
            return res.json({
                success: false
            })
        }

        // 쿼리 생성 및 디비 요청
        let query = "SELECT * FROM wished WHERE user_id = ? AND product_id = ?;" // 유저가 특정 상품을 찜 했는지 조회
        req.app.get('dbConnection').query(query, [userId, productId], (err, results) => {
            if (err) throw err

            if (results.length) { // 결과값(유저가 찜한 상품)이 존재하는 경우
                query = 'DELETE FROM wished WHERE user_id = ? AND product_id = ?;' // 상품의 찜을 해제(찜 테이블에서 제거, delete)
                req.app.get('dbConnection').query(query, [userId, productId], (err) => {
                    if (err) throw err

                    return res.json({
                        success: true,
                        perform: "delete"
                    })
                })
            } else { // 결과값(유저가 찜한 상품)이 존재하지 않는 경우
                query = 'INSERT INTO wished (user_id, product_id) VALUES(?, ?);' // 상품의 찜을 추가(찜 테이블에 추가, create)
                req.app.get('dbConnection').query(query, [userId, productId], (err) => {
                    if (err) throw err

                    return res.json({
                        success: true,
                        perform: "create"
                    })
                })
            }
        })
    },

    read: (req, res) => {
        // 쿼리스티링이 비어있는 경우 바로 종료
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        // 쿼리스트링으로 부터 값을 얻어 온다.
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
        const query = "SELECT * FROM wished WHERE user_id = ?;" // 유저가 찜한 상품을 모두 조회
        req.app.get('dbConnection').query(query, userId, (err, results) => {
            if (err) throw err

            return res.json({
                success: true,
                data: results
            })
        })
    }
}

module.exports = { wished }
