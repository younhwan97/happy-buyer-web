"use strict";

/* Module */
const express = require('express')
const app = express()
const fileUpload = require('express-fileupload');

/* Routing */
const home = require("./src/routes")

/* App Setting */
app.set("views", "./src/views")
app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/src/assets`));
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use("/", home);

module.exports = app