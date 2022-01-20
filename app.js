"use strict";

/* Module */
const express = require('express')
const app = express()
const fileUpload = require('express-fileupload');

/* Routing */
const home = require("./routes")

/* App Setting */
app.set("views", "./views")
app.set('view engine', 'pug');
app.use(express.static(`${__dirname}/assets`));
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

app.post('/api/upload', home)

app.post('/api/addproduct', home)

app.post('/api/product/remove', home)

module.exports = app