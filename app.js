const express = require('express')
const app = express()
const port = 80 /* web server port */
app.use(express.static('assets'));
app.set('view engine', 'pug'); /* template engine */

/* AWS SDK s*/
var AWS = require("aws-sdk");
AWS.config.region = 'ap-northeast-2'

AWS.config.getCredentials(function(err) {
    if (err) console.log(err.stack);
    // credentials not loaded
    else {
        console.log("Access key:", AWS.config.credentials.accessKeyId);
    }
});


/* routing */
app.get('/', (req, res) => {

    res.render('app',
        {
            page: "home",
        }
    )
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


app.listen(port, () => {
    console.log(`Connected ${port} port`);
})