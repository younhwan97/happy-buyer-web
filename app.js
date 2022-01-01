const express = require('express')
const app = express()
const port = 3000
app.use(express.static('assets'));
app.set('view engine', 'pug');

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


app.get('/orders', (req, res) => {
    res.render('app',
        {
            page: "orders",

        }
    )
})


app.listen(port, () => {
    console.log(`App listening at ${port} port`);
})