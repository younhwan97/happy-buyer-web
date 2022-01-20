"use strict";

/* module */
const fs = require('fs')
const express = require('express')
const AWS = require('aws-sdk')
AWS.config.update({region: 'ap-northeast-2'});
const s3 = new AWS.S3()
const app = express()

const PORT = 80

/* routing */
const home = require("./routes/home")
const api = require('./routes/api')

/* Setting App */
app.set("views", "./views")
app.set('view engine', 'pug');

/* Connect to AWS RDS */
const mysql = require('mysql');
const conf = JSON.parse(fs.readFileSync('./config/database.json', 'utf-8')); // read db config file in server
const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

app.use(express.static('assets'));

/* Body parser */
app.use(express.json())

/* Upload to file in server */
const fileUpload = require('express-fileupload');
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

/* routing */
app.use("/", home);

app.use("/api/order", api)

app.get('/products', (req, res) => {

    const query = 'SELECT * FROM (product) WHERE category <> ? ORDER BY product_id DESC;'

    connection.query(query, '미선택', (err, results, fields)=> {
        if (err) throw err;

        let products = [] // 상품 목록

        if (results.length !== 0){
            for(let i = 0; i < results.length; i++){
                products.push(results[i])
            }
        }

        res.render('app',
            {
                page: "products",
                products: products
            }
        )
    })
})

app.get('/addproduct', (req, res) => {
    res.render('app',
        {
            page: "addproduct",
        }
    )
})

app.post('/api/upload', (req, res) => {
    let file // client 에서 전송받은 파일
    let params // s3 접속을 위한 params

    if (!req.files || Object.keys(req.files).length === 0) { // 업로드할 파일이 없을 때
        res.json({
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

        res.json({
            status: 'success',
            url: data.Location
        })
    })
})

app.post('/api/addproduct', (req, res) => {
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
})

app.post('/api/product/remove', (req, res) => {
    let query
    let productId

    if (!req.body || Object.keys(req.body).length === 0) { // 상품 데이터가 없을 때
        return res.json({
            status: 'fail'
        })
    }

    query = 'DELETE FROM product WHERE product_id = ?'
    productId = req.body.productId

    connection.query(query, productId, (err, results, fields) => {
        if (err) throw err

        return res.json({
            status: 'success'
        })
    })
})

app.get('/dashboard', (req, res) => {
    res.render('app',
        {
            page: "dashboard",
        }
    )
})


app.listen(PORT, () => {
    console.log(`Connected 80 port`);
})