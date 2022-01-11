const fs = require('fs')
const express = require('express')
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
app.set('view engine', 'pug'); /* template engine */


/* routing */
app.get('/', (req, res) => {
    let ds = req.query.ds;
    if (ds === undefined || ds === null) ds = "ready";

    /* ds(delivery status) 쿼리스트링에 따라 order_history 테이블을 조회하는 쿼리 생성 */
    const query = 'SELECT * FROM (order_history) WHERE delivery_status = ? OR delivery_status = ?;'
    let status = null;

    if (ds === "ready") // 배달 준비 상태의 데이터 조회
        status = [false, false];
    else if (ds === "completed") // 배달 완료 상태의 데이터 조회
        status = [true, true];
    else if(ds === "all") // 모든 상태의 데이터 조회
        status = [true, false];

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
        /* 주문 목록의 order ID 를 이용해 product ID 를 구한다. */
        let query = 'SELECT product_id FROM (order_product_mapping) WHERE order_id = ?'
        connection.query(query, orderId, (err, results, fields) => {
            if (err) throw err;

            let productId = []
            query = 'SELECT * FROM (product) WHERE'

            for(let i = 0; i < results.length; i++)
                productId.push(results[i].product_id)

            for(let i= 0; i < productId.length; i++){
                query = query+ ' product_id = ?'
                if (i !== productId.length - 1){
                    query += ' OR'
                }
            }

            connection.query(query, productId, (err, results, fields) => {
                res.json({
                    status: 'success',
                    data: results
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
    res.render('app',
        {
            page: "products",

        }
    )
})

app.get('/addproduct', (req, res) => {
    res.render('app',
        {
            page: "addproduct",

        }
    )
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