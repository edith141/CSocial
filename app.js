const express = require('express')
const app = express()
const routes = require('./routes')
 
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('public'))

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', routes)

app.listen(3000)