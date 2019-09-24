const express = require('express')
const app = express()
const routes = require('./routes')
const session = require('express-session')
const MongoStorage = require('connect-mongo')(session)

let sessinConfig  = session ({
    secret: "gTiueuLjghDWpmvduyQRUpb-412Kpcoks76rasjHFGSJ",
    resave : false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24, httpOnly: true},
    store: new MongoStorage({client: require('./dbase')})
})

app.use(sessinConfig)

app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(express.static('public'))

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', routes)

module.exports = app