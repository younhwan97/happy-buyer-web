"use strict";

/* Module */
const fs = require("fs")
const express = require('express')
const app = express()
const fileUpload = require('express-fileupload')
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)
const conf = JSON.parse(fs.readFileSync('./src/config/database.json', 'utf-8'))
const sessionStore = new MySQLStore({
    host: conf.host,
    port: conf.port,
    user: conf.user,
    password: conf.password,
    database: conf.database,
})

/* Routing */
const home = require("./src/routes")

/* App Setting */
app.set("views", "./src/views")
app.set('view engine', 'pug')
app.use(express.static(`${__dirname}/src/assets`))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))
app.use(session({
    key: 'session_cookie_name',
    secret: 'session_cookie_secret',
    store: sessionStore,
    resave: false,
    saveUninitialized: false
}))

app.use("/", home)

module.exports = app