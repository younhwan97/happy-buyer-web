"use strict";

const address = {
    create: (req, res) => {
        // 리퀘스트 바디가 비어있는 경우 바로 종료
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        // 리퀘스트 바디로 부터 값을 얻어온다.
        let userId = req.body.user_id || -1
        let receiver = req.body.receiver_name
        let phone = req.body.phone_number
        let address = req.body.address

        // 타입체크
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
        let query = "INSERT INTO address (user_id, receiver, phone, address) VALUES (?, ?, ?, ?);"
        req.app.get('dbConnection').query(query, [userId, receiver, phone, address], (err, results) => {
            if (err) throw err

            return res.json({
                success: true
            })
        })
    },

    update: (req, res) => {

    }
}

module.exports = {address}
