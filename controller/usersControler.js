const User = require('../model/User')


exports.loggedIn = function(req, res, next) {
    if (req.session.user) {
        next()
    }
    else {
        req.flash('lastLoginInfo', 'MUST BE LOGGED IN!')
        req.session.save()
        res.redirect('/')
    }
}


exports.login = (req, res) => {
    let user = new User(req.body)
    user.login()
    .then( (msg) => {
        req.session.user = {userName: user.data.username}
        // res.send(msg)
    })
    .then( () => {
        res.redirect('/')
    })
    .catch( (msg) => {
        // res.send(msg)
        console.log(msg)
        // just a npm pckg to bundle one-off flash msg obj in session like in express 2.X 
        req.flash('lastLoginInfo', 'Invalid credentials. Retry with correct username & password.')
        
    }).then( () => {
        res.redirect('/')
    })

}

exports.signUp = async (req, res) => {
    let user = new User(req.body)
    await user.userNameIsUnique()
    await user.emailIsUnique()
    user.register()
    if (user.errors.length != 0){
        console.log('something in arrar')
        //res.send(user.errors)
        req.flash('signUpErrors', user.errors)
        req.session.save( () => {
            console.log(user.errors)
            res.redirect('/')
        })
    }
    else if (user.errors.length == 0){
        console.log(user.errors)
        req.session.user = {userName: user.data.username}
        res.redirect('/')
    }
}

exports.logout = (req, res) => {
    req.session.destroy(() => {
        // res.render('home-guest.ejs')
        res.redirect('/')
    })
    // console.log('LOGGED OUT!')
    // res.render('home-guest.ejs')
}

exports.home = (req, res) => {
    if (req.session.user) {
        // console.log(req.session.user.userName)
        res.render('home-empty.ejs')
    }
    else {
        res.render('home-guest.ejs', {lastLogin: req.flash('lastLoginInfo'), regErrors: req.flash('signUpErrors')})
    }
}