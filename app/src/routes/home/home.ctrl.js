"use strict";

const order = {
    view: (req, res) => {
        // 세션 및 유저 정보 확인
        if (!req.session || Object.keys(req.session).length === 0 || !req.session.is_logined) {
            return res.redirect('/auth/login')
        }

        const loginInfo = {
            nickname: req.session.nickname,
            role: req.session.role
        }

        // 쿼리로부터 데이터 추출
        // ds(delivery_status) = ready(주문접수, 주문확인), delivered(배달완료)
        const ds = req.query.ds || "ready"
        const date = req.query.date || ""

        // 쿼리스트링에 따라 order_history 테이블을 조회하는 쿼리 조건 생성
        let query = "SELECT * FROM order_history WHERE status = "

        if (ds === "ready") {
            query += req.app.get('mysql').escape("주문접수")
            query += "OR status = "
            query += req.app.get('mysql').escape("주문확인")
        } else {
            query += req.app.get('mysql').escape("배달완료")

            if (date === "") {
                query += "AND DATE(date) = DATE(DATE_ADD(NOW(), INTERVAL 9 HOUR))"
            } else {
                query += "AND DATE(date) = " + req.app.get('mysql').escape(date)
            }
        }

        query += "ORDER BY order_id DESC;"

        // DB 요청
        req.app.get('dbConnection').query(query, (err, results) => {
            if (err) throw err

            return res.render('app',
                {
                    page: "home",
                    login: loginInfo,
                    options: {
                        ds: ds,
                        date: date
                    },
                    orders: results,
                }
            )
        })
    },

    create: (req, res) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        // request body data
        let userId = req.body.user_id || -1
        const name = req.body.name || "-" // not null
        const status = req.body.status || "주문접수" // not null

        const receiver = req.body.receiver // not null
        const phone = req.body.phone // not null
        const address = req.body.address // not null
        const requirement = req.body.requirement
        const point = req.body.point
        const detectiveHandlingMethod = req.body.detective_handling_method // not null
        const payment = req.body.payment // not null
        const originalPrice = req.body.original_price // not null
        const eventPrice = req.body.event_price // not null
        const bePaidPrice = req.body.be_paid_price // not null

        const products = req.body.products

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

        // 전달된 상품이 없을 경우 바로 종료
        if (products.length === 0) {
            return res.json({
                success: false
            })
        }

        // 널 체크
        if (name == null || status == null || receiver == null || phone == null || address == null || detectiveHandlingMethod == null || payment == null || originalPrice == null || eventPrice == null || bePaidPrice == null) {
            return res.json({
                success: false
            })
        }

        // 시간 구하기 (KR)
        const curr = new Date();
        const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
        const kr_item_diff = 9 * 60 * 60 * 1000;
        const kr_curr = new Date(utc + (kr_item_diff));

        let insertData = {
            user_id: userId,
            name: name,
            status: status,
            date: kr_curr,
            receiver: receiver,
            phone: phone,
            address: address,
            requirement: requirement,
            point: point,
            detective_handling_method: detectiveHandlingMethod,
            payment: payment,
            original_price: originalPrice,
            event_price: eventPrice,
            be_paid_price: bePaidPrice
        }

        // 쿼리 생성 및 디비 요청
        let query = "INSERT INTO order_history SET ?;"
        req.app.get("dbConnection").query(query, insertData, (err, results) => {
            if (err) throw err

            if (results === undefined || results === null || results.length === 0) {
                return res.json({
                    success: false
                })
            }

            let orderId = results.insertId

            let values = []
            for (let i = 0; i < products.length; i++) {
                values.push([orderId, products[i].product_id, products[i].count, products[i].price])
            }

            query = "INSERT INTO order_product_mapping (order_id, product_id, count, price) VALUES ?;"
            req.app.get("dbConnection").query(query, [values], (err) => {
                if (err) throw err

                return res.json({
                    success: true,
                    order_id: orderId
                })
            })
        })
    },

    read: (req, res) => {
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        // request body data
        let userId = req.query.id || -1
        let pageNum = req.query.page || 1

        // 타입체크
        if (typeof userId !== "number") {
            userId = Number(userId)
        }

        if (typeof pageNum !== "number") {
            pageNum = Number(pageNum)
        }

        // 유저 아이디가 -1인 경우 바로 종료
        if (userId === -1) {
            return res.json({
                success: false
            })
        }

        // 페이저 번호가 1보다 작은 경우 바로 종료
        if (pageNum < 1) {
            return res.json({
                success: false
            })
        }

        // 쿼리 생성 및 디비 요청
        let query = "SELECT * FROM order_history WHERE user_id = ? ORDER BY order_id DESC LIMIT ?, 10;"
        req.app.get("dbConnection").query(query, [userId, (pageNum - 1) * 10], (err, results) => {
            if (err) throw err

            return res.json({
                success: true,
                data: results
            })
        })
    },

    update: (req, res) => {
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        // 쿼리로부터 데이터 추출
        const orderId = req.query.id
        const status = req.query.status

        // 쿼리 생성 및 디비 요청
        const query = "UPDATE order_history SET status = ? WHERE order_id = ?;"
        req.app.get('dbConnection').query(query, [status, orderId], (err) => {
            if (err) throw err

            return res.json({
                success: true
            })
        })
    },

    delete: (req, res) => {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false
            })
        }

        const orderId = req.body.id

        // 쿼리 생성 및 디비 요청
        let query = req.app.get('mysql').format('DELETE FROM order_product_mapping WHERE order_id = ?;', orderId)
        query += req.app.get('mysql').format('DELETE FROM order_history WHERE order_id = ?;', orderId)
        req.app.get('dbConnection').query(query, (err) => {
            if (err) throw err

            return res.json({
                success: true
            })
        })
    }
}

const order_detail = {
    read: (req, res) => {
        if (req.session.is_logined && req.session.role === "guest") { // 사용자 권한을 확인
            return res.json({
                success: false,
                hasRole: false
            })
        }

        if (!req.query || Object.keys(req.query).length === 0) { // orderId 가 없을 때
            return res.json({
                success: false
            })
        }

        const orderId = req.query.id

        // 쿼리 생성 및 디비 요청
        let query = "SELECT * FROM (order_history) WHERE order_id = ?;"
        req.app.get('dbConnection').query(query, orderId, (err, results) => {
            if (err) throw err;

            const orderInfo = {
                order_id: results[0].order_id,
                name: results[0].name || "-",
                status: results[0].status,
                date: results[0].date,
                receiver: results[0].receiver, // not null
                address: results[0].address, // not null
                phone: results[0].phone, // not null
                requirement: results[0].requirement || "-",
                point: results[0].point || "-",
                detective_handling_method: results[0].detective_handling_method,
                payment: results[0].payment,
                original_price: results[0].original_price,
                event_price: results[0].event_price,
                be_paid_price: results[0].be_paid_price
            }

            query = "SELECT product_id, count, price FROM (order_product_mapping) WHERE order_id = ?;"
            req.app.get('dbConnection').query(query, orderId, (err, results) => {
                if (err) throw err;

                let productId = []
                let products = results

                for (let i = 0; i < results.length; i++) {
                    productId.push(results[i].product_id)
                }

                query = "SELECT * FROM product WHERE product_id IN (?);"
                req.app.get("dbConnection").query(query, [productId], (err, results) => {
                    if (err) throw err

                    for (let i = 0; i < results.length; i++) {
                        for (let j = 0; j < products.length; j++) {
                            if (results[i].product_id === products[j].product_id) {
                                products[j].name = results[i].name
                                break
                            }
                        }
                    }

                    return res.json({
                        success: true,
                        products: products,
                        order_info: orderInfo
                    })
                })
            })
        })
    },
}

const order_products = {
    read: (req, res) => {
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        // request body data
        let orderId = req.query.id || -1

        // 타입체크
        if (typeof orderId !== "number") {
            orderId = Number(orderId)
        }

        // 주문 번호가 -1인 경우 바로 종료
        if (orderId === -1) {
            return res.json({
                success: false
            })
        }

        // 쿼리 생성 및 디비 요청
        let query = "SELECT * FROM order_product_mapping WHERE order_id = ?;"
        req.app.get("dbConnection").query(query, orderId, (err, results) => {
            if (err) throw err

            if (results.length === 0) {
                return res.json({
                    success: false
                })
            }

            let productsId = []
            let mappingResults = results

            for (let i = 0; i < results.length; i++) {
                productsId.push(results[i].product_id)
            }

            query = "SELECT * FROM product WHERE product_id IN (?);"
            req.app.get("dbConnection").query(query, [productsId], (err, results) => {
                if (err) throw err

                if (results.length === 0) {
                    return res.json({
                        success: false
                    })
                }

                for (let i = 0; i < results.length; i++) {
                    for (let j = 0; j < mappingResults.length; j++) {
                        if (results[i].product_id === mappingResults[j].product_id) {
                            results[i].price = mappingResults[j].price
                            results[i].count = mappingResults[j].count
                            break
                        }
                    }
                }

                return res.json({
                    success: true,
                    data: results
                })
            })
        })
    }
}

module.exports = {
    order,
    order_detail,
    order_products
}
