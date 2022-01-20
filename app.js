"use strict";

/* module */
const express = require('express')
const fileUpload = require('express-fileupload');
const PORT = 80
const app = express()

app.use(express.static('assets'));

/* Body parser */
app.use(express.json())

/* Upload to file in server */
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

/* routing */
const home = require("./routes")

/* Setting App */
app.set("views", "./views")
app.set('view engine', 'pug');

app.use("/", home);

app.use("/products", home)

app.use('/addproduct', home)

app.use("/dashboard", home)

app.use("/api/order", home)

app.post('/api/upload', home)

app.post('/api/addproduct', home)

app.post('/api/product/remove', home)

app.listen(PORT, () => {
    console.log(`Connected 80 port`);
})