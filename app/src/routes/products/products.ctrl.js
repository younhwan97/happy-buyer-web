"use strict";

const fs = require('fs')

const products = {
    view: (req, res) => {
        // 세션 및 유저 정보 확인
        if (!req.session || Object.keys(req.session).length === 0 || !req.session.is_logined) {
            return res.redirect('/auth/login')
        }

        const login = {
            nickname: req.session.nickname,
            role: req.session.role
        }

        // 쿼리 생성 및 디비 요청
        const query = "SELECT * FROM product WHERE category <> ? AND status <> ? ORDER BY product_id DESC;"
        req.app.get('dbConnection').query(query, ['미선택', '삭제됨'], (err, results) => {
            if (err) throw err

            return res.render('app',
                {
                    page: "products",
                    login: login,
                    products: results
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

        const status = req.body.status
        const category = req.body.category
        const name = req.body.name
        const price = req.body.price
        const url = req.body.url

        if ((status !== "판매중" && status !== "품절") || category === undefined || name === undefined || price === undefined || url === undefined) {
            return res.json({
                success: false
            })
        }

        const data = [status, category, name, price, url]

        // 쿼리 생성 및 디비 요청
        const query = 'INSERT INTO product (status, category, name, price, image_url) VALUES (?, ?, ?, ?, ?)'
        req.app.get('dbConnection').query(query, data, (err) => {
            if (err) throw err

            return res.json({
                success: true
            })
        })
    },

    read: (req, res) => {
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        const category = req.query.category
        const keyword = req.query.keyword
        const sortBy = req.query.sort
        let pageNum = req.query.page || 1

        if (pageNum < 1) {
            return res.json({
                success: false
            })
        }

        let except_status = '삭제됨'
        let query = 'SELECT * FROM product WHERE status <> ' + req.app.get('mysql').escape(except_status)

        if (category !== "전체") {
            query += ' AND category = ' + req.app.get('mysql').escape(category)
        }

        if (keyword) {
            query += ' AND name LIKE ' + req.app.get('mysql').escape('%' + keyword + '%')
        }

        if (sortBy) {
            if (sortBy === "판매순") {
                query += " ORDER BY sales DESC"
            } else if (sortBy === "낮은 가격순") {
                query += " ORDER BY price"
            } else if (sortBy === "높은 가격순") {
                query += " ORDER BY price DESC"
            }
        }

        query += " LIMIT " + req.app.get('mysql').escape((pageNum - 1) * 30)
        query += ", 30;"


        console.log(query)
        req.app.get('dbConnection').query(query, (err, results) => {
            if (err) throw err

            if (!results.length) {
                // 검색된 상품이 없을 때
                return res.json({
                    success: false
                })
            }

            let products = results
            query = 'SELECT * FROM event_product;'

            req.app.get('dbConnection').query(query, (err, results) => {
                if (err) throw err

                let eventProducts = results

                for (let i = 0; i < eventProducts.length; i++) {
                    for (let j = 0; j < products.length; j++) {
                        if (eventProducts[i].product_id === products[j].product_id) {
                            products[j].on_sale = true
                            products[j].event_price = eventProducts[i].event_price
                            break
                        }
                    }
                }

                return res.json({
                    success: true,
                    data: products
                })
            })
        })
    },

    update: (req, res) => {

    },

    delete: (req, res) => {
        // 세션 및 유저 권한 확인
        if (!req.session || Object.keys(req.session).length === 0 || !req.session.is_logined) {
            return res.redirect('/auth/login')
        }

        if (req.session.is_logined && req.session.role === 'guest') {
            return res.json({
                success: false,
                hasRole: false
            })
        }

        if (!req.body || Object.keys(req.body).length === 0) {
            return res.json({
                success: false,
                hasRole: true
            })
        }

        // 바디로부터 데이터 추출
        const productId = req.body.product_id

        // 쿼리 생성 및 디비 요청
        let query = "UPDATE product SET status = ? WHERE product_id =?;"
        req.app.get('dbConnection').query(query, ["삭제됨", productId], (err) => {
            if (err) throw err

            return res.json({
                success: true
            })
        })
    }
}

const add_products = {
    view: (req, res) => {
        // 세션 및 유저 정보 확인
        if (!req.session || Object.keys(req.session).length === 0 || !req.session.is_logined) {
            return res.redirect('/auth/login')
        }

        const login = {
            nickname: req.session.nickname,
            role: req.session.role
        }

        return res.render('app',
            {
                page: "add_product",
                login: login,
            }
        )
    }
}

const s3 = {
    create: (req, res) => {
        if (req.session.role === 'guest') { // 게스트 로그인
            return res.json({
                success: false,
                hasRole: false
            })
        }

        let file // client 에서 전송받은 파일
        let params // s3 접속을 위한 params

        if (!req.files || Object.keys(req.files).length === 0) { // 업로드할 파일이 없을 때
            return res.json({
                success: false,
                hasRole: true
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

        req.app.get('s3').upload(params, (err, data) => {
            if (err) throw err

            return res.json({
                success: true,
                url: data.Location
            })
        })
    }
}

module.exports = {
    products,
    add_products,
    s3
}
