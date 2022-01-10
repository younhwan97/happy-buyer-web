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
    const sql = 'SELECT * FROM (order_history);'

    connection.query(sql, (err, results, fields)=>{
        if (err) throw err;

        let order_history = []; /* 주문 목록 */

        if(results.length !== 0){
            for(let i = 0; i < results.length; i++){
                order_history.push(results[i])
            }
        }

        res.render('app',
            {
                page: "home",
                orders: order_history,
            }
        )
    })
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