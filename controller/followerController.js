const Follow = require('../model/Follow')

exports.addFollower = function (req, res) {

    let follow = new Follow(req.params.username, req.visitorId)
    follow.create()
    .then(() => {
        req.flash("success", `Following ${req.params.username}!`)
        req.session.save(() => {
            res.redirect(`/UserProfile/${req.params.username}`)
        })
        
    })
    .catch((errs) => {
        req.flash("errors", 'uhoh! sneaking?')
        req.session.save(() => {
            res.redirect('/')
        })
    })
}