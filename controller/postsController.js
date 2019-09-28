const Post = require('../model/Post')

exports.createScr = function (req, res) {
    res.render('new-post.ejs')
}


exports.createPost = function (req, res) {
    let post = new Post(req.body, req.session.user._id)
    post.createPost().then( () => {
        console.log(req.session.user._id)
        res.send("NEW POST DONE!")
    }).catch( (err) => {
        console.log(err)
    })
}

exports.viewPost = async function (req, res) {
    // res.render('apost.ejs')
    try {
        let post = await Post.getOneById(req.params.id, req.visitorId)
        res.render('apost.ejs', {post: post})
    }

    catch {
        res.render("e404")
    }
}

exports.viewPostEditScr = async function (req, res) {
    try {
        let post = await Post.getOneById(req.params.id)

        //render only if user is the owener of the post!
        if (post.authorId == req.visitorId) {
            res.render("edit-post.ejs", {post: post})
        }
        else {
            req.flash("errors", 'insufficient permissions!')
            req.session.save( () => {
                res.redirect('/')
            })
        }
        
    }
    catch {
        res.render('e404.ejs')
    }
}

exports.editPost = function(req, res) {
    let post = new Post(req.body, req.visitorId, req.params.id)
    post.update()
    .then( (st) => {
        //updated in db or user left a field blank???
        if (st == 'success') {
            //updated in db
            req.flash('success', 'succefully updated the post!')
            req.session.save(() => {
                res.redirect(`/post/${req.params.id}/edit`)
            })
        }
        else {
            //errors
            post.errors.forEach( (err) => {
                req.flash('errors', err)
            })
            req.session.save( () => {
                res.redirect(`/post/${req.params.id}/edit`)
            })
        }

    })
    .catch( () => {
        //no post with id or visitor not the owener!
        req.flash("errors", "insufficient permissions")
    })
}