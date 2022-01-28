"use strict";

/* Module */
const fs = require('fs')
const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const fileUpload = require('express-fileupload')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)
const dbConf = JSON.parse(fs.readFileSync('./src/config/database.json', 'utf-8'))
const sessionConf = JSON.parse(fs.readFileSync('./src/config/session.json', 'utf-8'))
const sessionStore = new MySQLStore({
    host: dbConf.host,
    port: dbConf.port,
    user: dbConf.user,
    password: dbConf.password,
    database: dbConf.database,
})
const socketIO = require("socket.io")
const io = socketIO(server)

/* App Setting */
app.set("views", "./src/views")
app.set('view engine', 'pug')
app.set('io', io)
app.use(express.static(`${__dirname}/src/assets`))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
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

app.use("/", homeRouter)
app.use("/auth", authRouter)
app.use("/products", productRouter)
app.use("/dashboard", dashboardRouter)

module.exports = server