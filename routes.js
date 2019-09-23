const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('home-guest.ejs')
})

router.get('/about', (req, res) => {
    res.send('lalalala')
})

module.exports = router