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
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

app.use("/", home);

app.use("/products", home)

app.use('/addproduct', home)

app.use("/dashboard", home)

app.use("/api/order", home)

app.use('/api/upload', home)

app.use('/api/addproduct', home)

app.use('/api/product/remove', home)

module.exports = app