"use strict";

/* Module */
const fs = require("fs")
const express = require("express")
const router = express.Router();
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

router.get('/', (req, res) => {
    const ds = req.query.ds || "ready";

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

module.exports = router;