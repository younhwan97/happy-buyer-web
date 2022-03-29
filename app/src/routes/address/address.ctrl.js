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
        let isDefault = req.body.is_default || false

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
        let query = "INSERT INTO address (user_id, receiver, phone, address, is_default) VALUES (?, ?, ?, ?, ?);"
        req.app.get('dbConnection').query(query, [userId, receiver, phone, address, isDefault], (err, results) => {
            if (err) throw err

            let newAddressId = results.insertId

            if (!isDefault) { // 새로운 배송지가 기본 배송지로 선택되지 않았을 때
                return res.json({
                    success: true,
                    address_id: newAddressId
                })
            }

            query = "UPDATE address SET is_default = ? WHERE address_id <> ? AND user_id = ?;" // 새로운 배송지가 기본 배송지로 선택되었을 때
            req.app.get('dbConnection').query(query, [false, newAddressId, userId], (err) => {
                if (err) throw err

                return res.json({
                    success: true,
                    address_id: newAddressId
                })
            })
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
        let query = "SELECT * FROM address WHERE user_id = ?;"
        req.app.get('dbConnection').query(query, userId, (err, results) => {
            if (err) throw err

            return res.json({
                success: true,
                data: results
            })
        })
    },

    update: (req, res) => {
        // 리퀘스트 바디가 비어있는 경우 바로 종료
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        // 리퀘스트 바디로 부터 값을 얻어온다.
        let userId = req.body.user_id || -1
        let addressId = req.body.address_id
        let receiver = req.body.receiver_name
        let phone = req.body.phone_number
        let address = req.body.address
        let isDefault = req.body.is_default || false

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
        let query = "SELECT * FROM address WHERE address_id = ?;"
        req.app.get('dbConnection').query(query, addressId, (err, results) => {
            if (err) throw err

            if (results.length === 0) {
                return res.json({
                    success: false
                })
            }

            query = "UPDATE address SET receiver = ?, phone = ?, address = ?, is_default = ? WHERE address_id = ? AND user_id = ?;"
            req.app.get('dbConnection').query(query, [receiver, phone, address, isDefault, addressId, userId], (err, results) => {
                if (err) throw err

                if (!isDefault) { // 수정된 배송지가 기본 배송지로 선택되지 않았을 때
                    return res.json({
                        success: true
                    })
                }

                query = "UPDATE address SET is_default = ? WHERE address_id <> ? AND user_id = ?;" // 수정된 배송지가 기본 배송지로 선택되었을 때
                req.app.get('dbConnection').query(query, [false, addressId, userId], (err) => {
                    if (err) throw err

                    return res.json({
                        success: true
                    })
                })
            })
        })
    },

    delete: (req, res) => {
        // 리퀘스트 바디가 비어있는 경우 바로 종료
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        // 리퀘스트 바디로 부터 값을 얻어온다.
        let userId = req.body.user_id || -1
        let addressId = req.body.address_id

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
        let query = "DELETE FROM address WHERE user_id = ? AND address_id = ?;"
        req.app.get('dbConnection').query(query, [userId, addressId], (err) => {
            if(err) throw err

            return res.json({
                success: true
            })
        })
    }
}

module.exports = {address}
