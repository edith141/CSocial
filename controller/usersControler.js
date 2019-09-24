const User = require('../model/User')


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

exports.signUp = (req, res) => {
    let user = new User(req.body)
    user.register()
    if (user.errors.length){
        res.send(user.errors)
    }
    else{
        res.send('YAY!!!!')
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
        res.render('home-empty.ejs', {currUserName: req.session.user.userName})
    }
    else {
        res.render('home-guest.ejs', {lastLogin: req.flash('lastLoginInfo')})
    }
}