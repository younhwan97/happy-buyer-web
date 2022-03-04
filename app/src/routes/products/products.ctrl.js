"use strict";

const fs = require('fs')

const view = {
    products : (req, res) => {
        if(!req.session.is_logined) return res.redirect('/auth/login')
        const login = {
            nickname : req.session.nickname,
            role : req.session.role
        }

        const query = 'SELECT * FROM (product) WHERE category <> ? AND status <> ? ORDER BY product_id DESC;'

        req.app.get('dbConnection').query(query, ['미선택', '삭제됨'], (err, results, fields)=> {
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
                    login: login,
                    products: products
                }
            )
        })
    },

    addProduct: (req, res) => {
        if(!req.session.is_logined) return res.redirect('/auth/login')
        const login = {
            nickname : req.session.nickname,
            role : req.session.role
        }

        return res.render('app',
            {
                page: "addproduct",
                login: login,
            }
        )
    }
}

const create = {
    s3 : (req, res) => {
        if(req.session.role === 'guest'){ // 게스트 로그인
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

        req.app.get('s3').upload(params, (err, data)=> {
            if (err) throw err

            return res.json({
                success: true,
                url: data.Location
            })
        })
    },

    product: (req, res) => {
        let query // 상품 추가를 위한 쿼리
        let data // 상품 데이터

        if (!req.body || Object.keys(req.body).length === 0) { // 상품 데이터가 없을 때
            return res.json({
                success: false
            })
        }

        query = 'INSERT INTO product (status, category, name, price, image_url) VALUES (?, ?, ?, ?, ?)'
        data = [req.body.status, req.body.category, req.body.name, req.body.price, req.body.url]

        req.app.get('dbConnection').query(query, data, (err, results, fields) => {
            if (err) throw err

            return res.json({
                success: true
            })
        })
    }
}

const read = {
    productByApp : (req, res) => { // 상품 1개를 읽어온다.
        let productId
        let kakaoAccountId
        let query

        if (!req.query || Object.keys(req.query).length === 0) { // 쿼리가 없을 때
            return res.json({
                success: false
            })
        }

        productId = req.query.pid
        kakaoAccountId = req.query.uid
        query = 'SELECT * FROM product WHERE product_id = ? AND status <> ?;'

        req.app.get('dbConnection').query(query, [productId, '삭제됨'], (err, results) => {
            if(err) throw err

            if(results.length === 0){
                return res.json({
                    success: false
                })
            }

            let product = results[0]
            query = 'SELECT * FROM event_product WHERE product_id = ?;'

            req.app.get('dbConnection').query(query, productId, (err, results) => {
                if(err) throw err

                if(results.length !== 0){
                    product.event_price  = results[0].event_price
                    product.on_sale = true
                }

                if(kakaoAccountId === -1 || kakaoAccountId === null){
                    return res.json({
                        success: true,
                        data: product
                    })
                }

                query = 'SELECT * FROM wished WHERE product_id = ? AND user_id = ?;'
                req.app.get('dbConnection').query(query, [productId, kakaoAccountId], (err, results) => {
                    if(err) throw err

                    if(results.length !== 0)
                        product.is_wished = true

                    return res.json({
                        success: true,
                        data: product
                    })
                })
            })
        })
    },

    productsByApp : (req, res) => { // 상품 여러개를 읽어온다.
        let category // 선택된 상품 카테고리
        let sort // 정렬 기준
        let query

        if (!req.query || Object.keys(req.query).length === 0) { // 쿼리가 없을 때
            return res.json({
                success: false
            })
        }

        category = req.query.category
        sort = req.query.sort

        if(category === "total"){
            if(sort === "popular"){
                query = req.app.get('mysql').format('SELECT * FROM product WHERE status <> ? ORDER BY sales DESC limit 6;', '삭제됨')
            } else if(sort === "basic"){
                query = req.app.get('mysql').format('SELECT * FROM product WHERE status <> ?;', '삭제됨')
            }
        } else {
            if(sort === "popular"){
                query = req.app.get('mysql').format('SELECT * FROM product WHERE category = ? AND status <> ? ORDER BY sales DESC limit 6', [category, '삭제됨'])
            } else if(sort === "basic"){
                query = req.app.get('mysql').format('SELECT * FROM product WHERE category = ? AND status <> ?;', [category, '삭제됨'])
            }
        }


        req.app.get('dbConnection').query(query, (err, results, fields) => {
            if(err) throw err

            let products = results
            query = 'SELECT * FROM event_product;'

            req.app.get('dbConnection').query(query, (err, results, fields)=>{
                if(err) throw err

                let eventProducts = results

                for(let i = 0; i < products.length; i++){
                    for(let k = 0; k < eventProducts.length; k++){
                        if(products[i].product_id === eventProducts[k].product_id){
                            products[i].on_sale = true
                            products[i].event_price = eventProducts[k].event_price
                            break;
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
}

const update = {

}

const remove = {
    product : (req, res) => {
        if(req.session.is_logined && req.session.role === 'guest'){ // 게스트 로그인
            return res.json({
                success: false,
                hasRole: false
            })
        }

        let productId

        if (!req.body || Object.keys(req.body).length === 0) { // 상품 데이터가 없을 때
            return res.json({
                success: false,
                hasRole: true
            })
        }

        productId = req.body.productId
        let query = 'UPDATE product SET status = ? WHERE product_id =?;'

        req.app.get('dbConnection').query(query, ["삭제됨", productId], (err, results, fields) => {
            if (err) throw err

            return res.json({
                success: true
            })
        })
    }
}

module.exports = {
    view,
    create,
    read,
    update,
    remove,
}
