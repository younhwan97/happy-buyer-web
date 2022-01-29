"use strict";

const view = {
    home: (req, res) => {
        if(!req.session.is_logined) return res.redirect('/auth/login')
        const login = {
            nickname : req.session.nickname,
            role : req.session.role
        }

        /* 쿼리스트링 값을 추출 */
        const ds = req.query.ds || "ready"
        const date = req.query.date || ""

        /* 쿼리스트링에 따라 order_history 테이블을 조회하는 쿼리 조건 생성 */
        // delivery_status = received  -> 주문 접수
        // delivery_status = confirmed -> 배달 준비
        // delivery_status = delivered -> 배달 완료
        let status
        let query

        if(ds === "ready"){ // delivery_status === (received || confirmed)
            status = ["received", "confirmed"]
            query = 'SELECT * FROM (order_history) WHERE status = ? OR status = ? ORDER BY order_id DESC;'
        } else if (ds === "delivered") { // 배달 완료 상태의 데이터 조회
            if(date === ""){ // 오늘 날짜로 배달 완료 상태의 데이터 조회
                status = ["delivered"]
                query = 'SELECT * FROM (order_history) WHERE status = ? AND DATE(date) = DATE(DATE_ADD(NOW(), INTERVAL 9 HOUR)) ORDER BY order_id DESC;'
            } else {        // 선택된 날짜로 배달 완료 상태의 데이터 조회
                status = ["delivered", date]
                query = 'SELECT * FROM (order_history) WHERE status = ? AND DATE(date) = ? ORDER BY order_id DESC;'
            }
        }

        /* order_history 테이블 조회 */
        req.app.get('dbConnection').query(query, status, (err, results, fields)=>{
            if (err) throw err

            let orders = [] // 주문 목록

            if(results.length !== 0){
                for(let i = 0; i < results.length; i++){
                    orders.push(results[i])
                }
            }

            return res.render('app',
                {
                    page: "home",
                    login: login,
                    options: {
                        ds : ds,
                        date: date
                    },
                    orders: orders,
                }
            )
        })
    },
}

const read = {
    order: (req, res) => {
        if (req.session.is_logined && req.session.role === "guest"){ // 사용자 권한을 확인
            return res.json({
                success: false,
                hasRole: false
            })
        }

        let orderId

        if (!req.query || Object.keys(req.query).length === 0) { // orderId 가 없을 때
            return res.json({
                success: false
            })
        }

        orderId = req.query.id // http://happybuyer.co.kr/api/read/order?id=orderId

        /* order ID 를 이용해 order_history 테이블에서 주문 정보를 확인한다. */
        let query = 'SELECT * FROM (order_history) WHERE order_id = ?;'
        req.app.get('dbConnection').query(query, orderId, (err, results, fields) => {
            if (err) throw err;

            const userInfo = { // 고객 정보를 저장
                name : results[0].name || "-",
                shippingAddress: results[0].shipping_adress, // not null
                pointNumber: results[0].point_number || "-",
                ds: results[0].status,
                date: results[0].date,
                payment: results[0].payment,
                request: results[0].request || '-',
            }

            /* order ID 를 이용해 order_product_mapping 테이블에서 productID, count 를 확인한다. */
            query = 'SELECT product_id, count FROM (order_product_mapping) WHERE order_id = ?;'
            req.app.get('dbConnection').query(query, orderId, (err, results, fields) => {
                if (err) throw err;

                let mapping = []

                for(let i = 0; i < results.length; i++) {
                    mapping.push({
                        productId : results[i].product_id,
                        count : results[i].count
                    })
                }

                let query = ""
                mapping.map( it =>
                    query += req.app.get('mysql').format('SELECT * FROM (product) WHERE product_id = ?;', it.productId)
                )

                req.app.get('dbConnection').query(query, (err, results, fields) => {
                    if (err) throw err;

                    let data = []

                    if(results.length === mapping.length && results){ // 검색한 상품의 갯수와 결과의 갯수가 일치할 때
                        if(results.length === 1){ // 상품을 1개만 주문했을 때
                            if(mapping[0].productId === results[0].product_id){
                                results[0].count = mapping[0].count
                                data.push(results[0])
                            } else {
                                return res.json({
                                    success: false
                                })
                            }
                        } else { // 상품을 여러개 주문했을 때
                            for(let i = 0; i < results.length; i++){
                                let isMatched = false // 검색한 상품이 검색 결과에 포함되어 있으면 true, 그렇지 않으면 false

                                for(let j = 0; j< mapping.length; j++){
                                    if(mapping[j].productId === results[i][0].product_id){
                                        isMatched = true
                                        results[i][0].count = mapping[j].count
                                        data.push(results[i][0])
                                        break;
                                    }
                                }

                                if(!isMatched){
                                    return res.json({
                                        success: false
                                    })
                                }
                            }
                        }
                    } else { // 특정 상품 or 검색 결과가 존재하지 않을 때
                        return res.json({
                            success: false
                        })
                    }

                    return res.json({
                        success: true,
                        data: data,
                        user: userInfo
                    })
                })
            })
        })
    },
}

const remove = {
    order : (req, res) => {
        let orderId // 제거할 orderId

        if (!req.body || Object.keys(req.body).length === 0) { // orderId 가 없을 때
            return res.json({
                success: false
            })
        }

        orderId = req.body.order
        let query = req.app.get('mysql').format('DELETE FROM order_product_mapping WHERE order_id = ?;', orderId)
        query += req.app.get('mysql').format('DELETE FROM order_history WHERE order_id = ?;', orderId)

        req.app.get('dbConnection').query(query, (err, results, fields)=>{
            if(err) throw err

            return res.json({
                success: true
            })
        })
    }
}

const update = {
    order : (req, res) => {
        let orderId // 업데이트할 orderId
        let status

        if (!req.query || Object.keys(req.query).length === 0) { // orderId 가 없을 때
            return res.json({
                success: false
            })
        }

        orderId = req.query.id
        status = req.query.status
        const query = 'UPDATE order_history SET status = ? WHERE order_id = ?;'

        req.app.get('dbConnection').query(query, [status, orderId], (err, results, fields) => {
            if(err) throw err

            return res.json({
                success: true
            })
        })
    }
}

const create = {
    order : (req , res) => {
        // 앱에서 온 데이터를 바탕으로 새로운 주문건 생성



        // 연결된 web page 에 메시지 전달
        const io = req.app.get('io')
        io.emit('hello', 'world')
    }
}

module.exports = {
    view,
    create,
    read,
    update,
    remove,
}
