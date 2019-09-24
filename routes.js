const express = require('express')
const router = express.Router()
const usersController = require('./controller/usersControler')

router.get('/', usersController.home)
router.post('/login', usersController.login)
router.post('/SignUp', usersController.signUp)

module.exports = router