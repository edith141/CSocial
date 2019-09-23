
const mdb = require('mongodb')
const denv = require('dotenv')
denv.config()


const cnxn = process.env.CNXNSTR
mdb.connect(cnxn, {useNewUrlParser: true, useUnifiedTopology: true}, (err, client) => {
    module.exports = client.db()
    require('./app').listen(process.env.PORT)
})

