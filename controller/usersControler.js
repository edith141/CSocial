const User = require('../model/User')


exports.login = (req, res) => {
    let user = new User(req.body)
    user.login()
    .then( (msg) => {
        req.session.user = {lol: "lal"}
        res.send(msg)
    })
    .catch( (msg) => {
        res.send(msg)
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

exports.logout = () => {

}

exports.home = (req, res) => {
    if (req.session.user) {
        res.send('LOGGED IN!')
    }
    else {
        res.render('home-guest.ejs')
    }
}