const User = require('../model/User')


exports.login = (req, res) => {
    let user = new User(req.body)
    user.login()
    .then( (msg) => {
        console.log(msg)
    })
    .catch( (msg) => {
        console.log(msg)
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
    res.render('home-guest.ejs')
}