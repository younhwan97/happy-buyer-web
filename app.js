const fs = require('fs')
const express = require('express')
const fileUpload = require('express-fileupload');
const AWS = require('aws-sdk')
AWS.config.update({region: 'ap-northeast-2'});
const s3 = new AWS.S3()
const app = express()

/* Connect to AWS RDS */
const mysql = require('mysql');
const conf = JSON.parse(fs.readFileSync('./config/database.json', 'utf-8')); /* read db config file in server */
const connection = mysql.createConnection({
    host: conf.host,
    user: conf.user,
    password: conf.password,
    port: conf.port,
    database: conf.database
});
connection.connect();

app.use(express.static('assets'));

/* Template engine */
app.set('view engine', 'pug');

/* Body parser */
app.use(express.json())

/* File Upload */
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

/* routing */
app.get('/', (req, res) => {
    let ds = req.query.ds || "ready";

    /* ds(delivery status) 쿼리스트링에 따라 order_history 테이블을 조회하는 쿼리 생성 */
    // delivery_status = received  -> 주문 접수
    // delivery_status = confirmed -> 배달 준비
    // delivery_status = delivered -> 배달 완료
    const query = 'SELECT * FROM (order_history) WHERE status = ? OR status = ? ORDER BY order_id DESC;'
    let status = null;

    if (ds === "ready") // 배달 접수, 배달 준비 상태의 데이터 조회
        status = ["received", "confirmed"];
    else if (ds === "delivered") // 배달 완료 상태의 데이터 조회
        status = ["delivered", "delivered"];

    /* order_history table 조회 */
    connection.query(query, status, (err, results, fields)=>{
        if (err) throw err;

        let orders = []; /* 주문 목록 */

        if(results.length !== 0){
            for(let i = 0; i < results.length; i++){
                orders.push(results[i])
            }
        }

        res.render('app',
            {
                page: "home",
                options: {
                    ds : ds
                },
                orders: orders,
            }
        )
    })
})

app.get('/api/order', (req, res) => {
    const orderId = req.query.id

    if(orderId){
        /* order ID 를 이용해 주문 정보를 확인한다. */
        let query = 'SELECT * FROM (order_history) WHERE order_id = ?'
        connection.query(query, orderId, (err, results, fields) => {
            const user = {
                'name' : results[0].name || "-",
                'shippingAddress': results[0].shipping_adress,
                'pointNumber': results[0].point_number || "-",
                'ds': results[0].status,
                'date': results[0].date
            }


            /* order ID 를 이용해 product ID 를 구한다. */
            query = 'SELECT product_id FROM (order_product_mapping) WHERE order_id = ?'
            connection.query(query, orderId, (err, results, fields) => {
                if (err) throw err;

                let productId = []

                for(let i = 0; i < results.length; i++)
                    productId.push(results[i].product_id)

                /* product ID 를 이용해 상품 정보를 확인한다. */
                query = 'SELECT * FROM (product) WHERE'

                for(let i= 0; i < productId.length; i++){
                    query = query+ ' product_id = ?'
                    if (i !== productId.length - 1){
                        query += ' OR'
                    }
                }

                connection.query(query, productId, (err, results, fields) => {
                    res.json({
                        status: 'success',
                        data: results,
                        user: user
                    })
                })
            })
        })
    } else {
        res.json({
            status: 'fail',
        })
    }
})

app.get('/products', (req, res) => {

    const query = 'SELECT * FROM (product) WHERE category <> ? ORDER BY product_id DESC;'

    connection.query(query, 'not', (err, results, fields)=> {
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

app.get('/dashboard', (req, res) => {
    res.render('app',
        {
            page: "dashboard",
        }
    )
})


app.listen(80, () => {
    console.log(`Connected 80 port`);
})