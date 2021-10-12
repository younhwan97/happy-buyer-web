const express = require('express')
const app = express()
const port = 3000
app.use(express.static('assets'));
app.set('view engine', 'pug');

/* firestore */
const admin = require('firebase-admin');
const serviceAccount = require('./assets/firebase/happybuyer-5d66d-firebase-adminsdk-ksuk9-f6f45e5887.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

app.get('/', (req, res) => {
    res.render('index',
        {
            page: "home",

        }
    )
})

app.get('/products', (req, res) => {
    res.render('index',
        {
            page: "products",

        }
    )
})

app.get('/orders', (req, res) => {
    res.render('index',
        {
            page: "orders",

        }
    )
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})