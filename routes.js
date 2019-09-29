const express = require('express')
const router = express.Router()
const usersController = require('./controller/usersControler')
const postsController = require('./controller/postsController')
const followController = require('./controller/followerController')

router.get('/', usersController.home)
router.post('/login', usersController.login)
router.post('/SignUp', usersController.signUp)
router.post('/logout', usersController.logout)

router.get('/new-post', usersController.loggedIn, postsController.createScr)
router.post('/new-post', usersController.loggedIn, postsController.createPost)
router.get('/post/:id', postsController.viewPost)
router.get('/UserProfile/post/:id', postsController.viewPost)
router.get('/post/:id/edit', usersController.loggedIn, postsController.viewPostEditScr)
router.post('/post/:id/edit', usersController.loggedIn, postsController.editPost)
router.post('/post/:id/delete', usersController.loggedIn, postsController.deletePost)
router.post('/search', postsController.search)



router.post('/addFollower/:username', usersController.loggedIn, followController.addFollower)




router.get('/UserProfile/:username' , usersController.ifUser, usersController.profilePostsScr)


module.exports = router