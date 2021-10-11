const express = require('express')
const app = express()
const port = 3000
app.use(express.static('assets'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
   res.render('index', {page:"home"})
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})