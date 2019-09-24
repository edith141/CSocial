const Post = require('../model/Post')

exports.createScr = function (req, res) {
    res.render('new-post.ejs')
}


exports.createPost = function (req, res) {
    let post = new Post(req.body, req.session.user._id)
    post.createPost().then( () => {
        res.send("NEW POST DONE!")
    }).catch( (err) => {
        console.log(err)
    })
}

exports.viewPost = async function (req, res) {
    // res.render('apost.ejs')
    try {
        let post = await Post.getOneById(req.params.id)
        res.render('apost.ejs', {post: post})
    }

    catch {
        res.render("e404")
    }
}