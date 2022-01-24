"use strict";

/* Module */
const fs = require("fs")
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const mysql = require('mysql');

AWS.config.update({region: 'ap-northeast-2'});

/* AWS RDS Setting */
const conf = JSON.parse(fs.readFileSync('./src/config/database.json', 'utf-8')); // read db config file in server
const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database,
    multipleStatements: true
});
connection.connect();


const view = {
    home: (req, res) => {
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
        connection.query(query, status, (err, results, fields)=>{
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
                    options: {
                        ds : ds,
                        date: date
                    },
                    orders: orders,
                }
            )
        })
    },

    products : (req, res) => {

        const query = 'SELECT * FROM (product) WHERE category <> ? AND status <> ? ORDER BY product_id DESC;'

        connection.query(query, ['미선택', '삭제됨'], (err, results, fields)=> {
            if (err) throw err;

            let products = [] // 상품 목록

            if (results.length !== 0){
                for(let i = 0; i < results.length; i++){
                    products.push(results[i])
                }
            }

            return res.render('app',
                {
                    page: "products",
                    products: products
                }
            )
        })
    },

    addProduct: (req, res) => {
        return res.render('app',
            {
                page: "addproduct",
            }
        )
    },

    dashboard: (req, res) => {
        return res.render('app',
            {
                page: 'dashboard'
            }
        )
    }
}

const read = {
    order: (req, res) => {
        let orderId

        if (!req.query || Object.keys(req.query).length === 0) { // orderId 가 없을 때
            return res.json({
                success: false
            })
        }

        orderId = req.query.id // http://happybuyer.co.kr/api/read/order?id=orderId

        /* order ID 를 이용해 order_history 테이블에서 주문 정보를 확인한다. */
        let query = 'SELECT * FROM (order_history) WHERE order_id = ?;'
        connection.query(query, orderId, (err, results, fields) => {
            if (err) throw err;

            const user = { // 고객 정보 객체
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
            connection.query(query, orderId, (err, results, fields) => {
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
                    query += mysql.format('SELECT * FROM (product) WHERE product_id = ?;', it.productId)
                )

                connection.query(query, (err, results, fields) => {
                    if (err) throw err;

                    let data = []

                    if(results.length === mapping.length && results){ // 검색한 상품의 갯수와 결과의 갯수가 일치할 때
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
                    } else { // 특정 상품 or 검색 결과가 존재하지 않을 때
                        return res.json({
                            success: false
                        })
                    }

                    return res.json({
                        success: true,
                        data: data,
                        user: user
                    })
                })
            })
        })
    },
}

const create = {
    s3 : (req, res) => {
        let file // client 에서 전송받은 파일
        let params // s3 접속을 위한 params

        if (!req.files || Object.keys(req.files).length === 0) { // 업로드할 파일이 없을 때
            return res.json({
                status: 'fail'
            })
        }

        file = req.files.file
        params = {
            'Bucket': 'hbb',
            'Key': file.name,
            'ACL': 'public-read',
            'Body': fs.createReadStream(file.tempFilePath),
            'ContentType': 'image/png',
        }

        s3.upload(params, (err, data)=> {
            if (err) throw err

            return res.json({
                status: 'success',
                url: data.Location
            })
        })
    },

    product: (req, res) => {
        let query // 상품 추가를 위한 쿼리
        let data // 상품 데이터

        if (!req.body || Object.keys(req.body).length === 0) { // 상품 데이터가 없을 때
            return res.json({
                status: 'fail'
            })
        }

        query = 'INSERT INTO product (status, category, name, price, image_url) VALUES (?, ?, ?, ?, ?)'
        data = [req.body.status, req.body.category, req.body.name, req.body.price, req.body.url]

        connection.query(query, data, (err, results, fields) => {
            if (err) throw err

            return res.json({
                status: 'success'
            })
        })
    }
}

const remove = {
    product : (req, res) => {
        let productId

        if (!req.body || Object.keys(req.body).length === 0) { // 상품 데이터가 없을 때
            return res.json({
                status: 'fail'
            })
        }

        productId = req.body.productId
        let query = 'UPDATE product SET status = ? WHERE product_id =?;'

        connection.query(query, ["삭제됨", productId], (err, results, fields) => {
            if (err) throw err

            return res.json({
                status: 'success'
            })
        })
    },

    order : (req, res) => {
        let orderId // 제거할 orderId

        if (!req.body || Object.keys(req.body).length === 0) { // orderId 가 없을 때
            return res.json({
                success: false
            })
        }

        orderId = req.body.order
        let query = mysql.format('DELETE FROM order_product_mapping WHERE order_id = ?;', orderId)
        query += mysql.format('DELETE FROM order_history WHERE order_id = ?;', orderId)

        connection.query(query, (err, results, fields)=>{
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

        connection.query(query, [status, orderId], (err, results, fields) => {
            if(err) throw err

            return res.json({
                success: true
            })
        })
    }
}

module.exports = {
    view,
    read,
    create,
    update,
    remove,
}
