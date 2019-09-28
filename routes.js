const express = require('express')
const router = express.Router()
const usersController = require('./controller/usersControler')
const postsController = require('./controller/postsController')

router.get('/', usersController.home)
router.post('/login', usersController.login)
router.post('/SignUp', usersController.signUp)
router.post('/logout', usersController.logout)

router.get('/new-post', usersController.loggedIn, postsController.createScr)
router.post('/new-post', usersController.loggedIn, postsController.createPost)
router.get('/post/:id', postsController.viewPost)


router.get('/UserProfile/:username' , usersController.ifUser, usersController.profilePostsScr)


module.exports = router