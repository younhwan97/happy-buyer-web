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
    productsByApp : (req, res) => { // 상품 여러개를 읽어온다.
        let query
        let keyword // 키워드
        let category // 선택된 상품 카테고리

        if (!req.query || Object.keys(req.query).length === 0) {
            return res.json({
                success: false
            })
        }

        category = req.query.category
        keyword = req.query.keyword

        let except_status = '삭제됨'
        query = 'SELECT * FROM product WHERE status <> ' + req.app.get('mysql').escape(except_status)

        if(category !== "total"){
            query += ' AND category = ' + req.app.get('mysql').escape(category)
        }

        if(keyword){
            query += ' AND name LIKE ' + req.app.get('mysql').escape('%'+keyword+'%')
        }

        query += ';'

        req.app.get('dbConnection').query(query, (err, results) => {
            if(err) throw err

            if(!results.length){
                // 검색된 상품이 없을 때
                return res.json({
                    success: false
                })
            }

            let products = results
            query = 'SELECT * FROM event_product;'

            req.app.get('dbConnection').query(query, (err, results)=>{
                if(err) throw err

                let eventProducts = results

                for(let i = 0; i < eventProducts.length; i++){
                    for(let j = 0; j < products.length; j++){
                        if(eventProducts[i].product_id === products[j].product_id){
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


        // if(category === "total"){
        //     if(sort === "popular"){
        //         if(keyword === "null"){
        //             query = req.app.get('mysql').format('SELECT * FROM product WHERE status <> ? ORDER BY sales DESC limit 6;', '삭제됨')
        //         } else {
        //             query =
        //                 req.app.get('mysql').format('SELECT * FROM product WHERE status <> ? AND name LIKE ? ORDER BY sales DESC limit 6;', ['삭제됨', '%'+keyword+'%'])
        //         }
        //     } else if(sort === "basic"){
        //         if(keyword === "null"){
        //             query = req.app.get('mysql').format('SELECT * FROM product WHERE status <> ?;', '삭제됨')
        //         } else {
        //             query = req.app.get('mysql').format('SELECT * FROM product WHERE status <> ? AND name LIKE ?;', ['삭제됨', '%'+keyword+'%'])
        //         }
        //     }
        // } else {
        //     if(sort === "popular"){
        //         if(keyword === "null") {
        //             query = req.app.get('mysql').format('SELECT * FROM product WHERE category = ? AND status <> ? ORDER BY sales DESC limit 6', [category, '삭제됨'])
        //         } else {
        //             query =
        //                 req.app.get('mysql').format('SELECT * FROM product WHERE category = ? AND status <> ? AND name LIKE ? ORDER BY sales DESC limit 6', [category, '삭제됨', '%'+keyword+'%'])
        //         }
        //     } else if(sort === "basic"){
        //         if(keyword === "null"){
        //             query = req.app.get('mysql').format('SELECT * FROM product WHERE category = ? AND status <> ?;', [category, '삭제됨'])
        //         } else {
        //             query = req.app.get('mysql').format('SELECT * FROM product WHERE category = ? AND status <> ? AND name LIKE ?;', [category, '삭제됨', '%'+keyword+'%'])
        //         }
        //     }
        // }
        //


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
