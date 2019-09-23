const express = require('express')
const app = express()
const t = require('./routes')
 
app.use(express.static('public'))
app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', t)

app.listen(3000)