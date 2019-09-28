const express = require('express')
const app = express()
const flash = require('connect-flash');
const routes = require('./routes')
const markdown = require('marked')
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
app.use(flash());
app.use(function(req, res, next) {


    //locals are acc. through ejs templates!
    res.locals.allowUserHTML =  (content) => {
        return markdown(content)
    }

    //flash msgs for temp
    res.locals.errors = req.flash("errors")
    res.locals.success = req.flash("success")

    if(req.session.user) {
        req.visitorId = req.session.user._id
    }
    else {
        req.visitorId = 0
    }

    res.locals.user = req.session.user
    next()
})

app.set('views', 'views')
app.set('view engine', 'ejs')

app.use('/', routes)

module.exports = app