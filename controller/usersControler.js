const User = require('../model/User')


exports.login = () => {
    
}

exports.signUp = (req, res) => {
    user = new User(req.body)
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
    res.render('home-guest.ejs')
}