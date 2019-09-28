const User = require('../model/User')
const Post = require('../model/Post')


exports.loggedIn = function(req, res, next) {
    if (req.session.user) {
        next()
    }
    else {
        req.flash('errors', 'MUST BE LOGGED IN!')
        req.session.save()
        res.redirect('/')
    }
}


exports.login = (req, res) => {
    let user = new User(req.body)
    user.login()
    .then( (result) => {
        // console.log(user.data._id)
        // console.log("lg from uctrl at login",user.data.username)
        // console.log("lg from uctrl at login " + String(result._id))
        req.session.user = {userName: user.data.username, _id: result._id}
        // res.send(msg)
        
        req.session.save()
    })
    .then( () => {
        res.redirect('/')
    })
    .catch( (msg) => {
        // res.send(msg)
        console.log(msg)
        // just a npm pckg to bundle one-off flash msg obj in session like in express 2.X 
        req.flash('errors', 'Invalid credentials. Retry with correct username & password.')
        
    }).then( () => {
        res.redirect('/')
    })

}

exports.signUp = async (req, res) => {
    let user = new User(req.body)
    await user.userNameIsUnique()
    await user.emailIsUnique()
    user.register().then((result) => {
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
            // console.log()
            console.log("lg frm UC sup fn" + String(result._id))
            req.session.user = {userName: user.data.username,  _id: result._id}
            req.session.save()
            res.redirect('/')
        }
    })
    .catch(() => {
        console.log("ERROR IN UCTRL SUP")
    })
    
}
// exports.signUp = async (req, res) => {
//     let user = new User(req.body)
//     await user.userNameIsUnique()
//     await user.emailIsUnique()
//     user.register()
//     if (user.errors.length != 0){
//         console.log('something in arrar')
//         //res.send(user.errors)
//         req.flash('signUpErrors', user.errors)
//         req.session.save( () => {
//             console.log(user.errors)
//             res.redirect('/')
//         })
//     }
//     else if (user.errors.length == 0){
//         console.log(user.errors)
//         // console.log()
//         req.session.user = {userName: user.data.username,  _id: user.data._id}
//         req.session.save()
//         res.redirect('/')
//     }
// }

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
        res.render('home-guest.ejs', {regErrors: req.flash('signUpErrors')})
        // res.render('home-guest.ejs', {errors: req.flash('errors'), regErrors: req.flash('signUpErrors')})
    }
}


exports.profilePostsScr = (req, res) => {
    //get posts by userid
    Post.getPostByUserId(req.profileUser._id)
    .then( (posts) => {
        res.render('p-posts.ejs', {
            posts: posts,
            profileUserName: req.profileUser.username
        })
    })
    .catch( () => {
        res.render('e404.ejs')
    })

    

}


exports.ifUser = (req, res, next) => {
    User.getUserByUserName(req.params.username)
    .then( (userDoc) => {
        //attach a user to req obj
        req.profileUser = userDoc
        next()
    })
    .catch( () => {
        res.render('e404.ejs')
    })
}