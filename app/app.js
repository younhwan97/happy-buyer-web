"use strict";

/* Module */
const fs = require('fs')
const fileUpload = require('express-fileupload')
// Express
const express = require('express')
const app = express()
// Socket.IO
const http = require('http')
const server = http.createServer(app)
const socketIO = require("socket.io")
const io = socketIO(server)
// AWS
const AWS = require('aws-sdk')
const mysql = require('mysql')
const s3 = new AWS.S3()
AWS.config.update({region: 'ap-northeast-2'})
const dbConf = JSON.parse(fs.readFileSync('./src/config/database.json', 'utf-8'))
const connection = mysql.createConnection({
    host: dbConf.host,
    user: dbConf.user,
    port: dbConf.port,
    password: dbConf.password,
    database: dbConf.database,
    multipleStatements: true,
    dateStrings: "date"
})
connection.connect()
// Session
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)
const sessionConf = JSON.parse(fs.readFileSync('./src/config/session.json', 'utf-8'))
const sessionStore = new MySQLStore({
    host: dbConf.host,
    port: dbConf.port,
    user: dbConf.user,
    password: dbConf.password,
    database: dbConf.database,
})

/* App Setting */
app.set("views", "./src/views")
app.set('view engine', 'pug')
app.set('io', io) // socket.io
app.set('dbConnection', connection) // aws rds connect
app.set('s3', s3) // aws s3 connect
app.set('mysql', mysql)
app.use(express.static(`${__dirname}/src/assets`))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))
app.use(session({
    secret: sessionConf.secret,
    resave: sessionConf.resave,
    saveUninitialized: sessionConf.saveUninitialized,
    store: sessionStore,
    // secure: sessionConf.secure
}))

/* Routing */
const homeRouter = require("./src/routes/home")
const authRouter = require("./src/routes/auth")
const productRouter = require("./src/routes/products")
const dashboardRouter = require("./src/routes/dashboard")
const basketRouter = require("./src/routes/basket")
const wishedRouter = require("./src/routes/wished")
const eventRouter = require("./src/routes/event")
const searchRouter = require('./src/routes/search')
const addressRouter = require("./src/routes/address")
const policyRouter = require("./src/routes/policy")

app.use("/", homeRouter)
app.use("/auth", authRouter)
app.use("/products", productRouter)
app.use("/dashboard", dashboardRouter)
app.use("/basket", basketRouter)
app.use("/wished", wishedRouter)
app.use("/event", eventRouter)
app.use("/search", searchRouter)
app.use("/address", addressRouter)
app.use("/policy", policyRouter)

module.exports = server