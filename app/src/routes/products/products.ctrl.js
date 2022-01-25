"use strict";

/* Module */
const fs = require("fs")
const AWS = require('aws-sdk')
const s3 = new AWS.S3()
const mysql = require('mysql');

AWS.config.update({region: 'ap-northeast-2'})

/* AWS RDS Setting */
const conf = JSON.parse(fs.readFileSync('./src/config/database.json', 'utf-8')) // read db config file in server
const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    port: conf.port,
    password: conf.password,
    database: conf.database,
    multipleStatements: true
});
connection.connect()


const view = {
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
    }
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
    }
}

module.exports = {
    view,
    create,
    remove,
}
