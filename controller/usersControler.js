const User = require('../model/User')

exports.login = () => {
    
}

exports.signUp = (req, res) => {
    user = new User(req.body)
    user.register()
}

exports.logout = () => {

}

exports.home = (req, res) => {
    res.render('home-guest.ejs')
}