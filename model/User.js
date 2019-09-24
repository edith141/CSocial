const usersColl = require('../dbase').db().collection('users')
const validator = require('validator')
const crypt = require('bcryptjs')


let User = function(data)  {
    this.data = data 
    this.errors = []
}

User.prototype.sanitize = function() {
    //stop mallicious code from being submitted

    this.data = {
        username: "" + this.data.username + "" .trim(),
        email: "" + this.data.email + "".trim(),
        password: "" + this.data.password
    }

    //redundant?
    if (typeof(this.data.username) != 'string') {
        this.data.username = String(this.data.username)
    }
    if (typeof(this.data.password) != 'string') {
        this.data.password = String(this.data.password)
    }
    if (typeof(this.data.email) != 'string') {
        this.data.email = String(this.data.email)
    }
}

User.prototype.validate = function() {
    //ValidSignUp?
    if (!validator.isAlphanumeric(this.data.username)) {
        this.errors.push(this.data.username + "is not a valid username")
    }
    if (this.data.username.length < 5 || this.data.username.length > 12 ) {
        this.errors.push("not a valid username. Should be between 5 and 12 char")
    }
    if (this.data.password == "") {
        this.errors.push(this.data.username + "is not a valid username")
    }
    if (this.data.password.length < 9 || this.data.username.length > 36 ) {
        this.errors.push("not a valid password. Should be between 9 and 36 char")
    }
}

User.prototype.register = function() {
    //UserData safe & valid?
    this.sanitize()
    this.validate()

    //then save it
    if (this.errors.length == 0) {
        //hash the password before storing in db
        let salt = crypt.genSaltSync(10)
        this.data.password = crypt.hashSync(this.data.password, salt)
        usersColl.insertOne(this.data)
    }
}

User.prototype.login = function () {
    this.sanitize()
    return new Promise((resolved, rejected) => {
        usersColl.findOne({ username: this.data.username })
            .then((currUser) => {
                if (currUser) {
                    //USER EXIST
                    if (crypt.compareSync(this.data.password, currUser.password)) {
                        //USER CRED OKAY
                        resolved("LOGGED IN")
                    }
                    else {
                        rejected("INV PW")
                    }
                }
                else {
                    rejected("NP USER")
                }
            })
            .catch((err) => {
                console.log("UhOh! Something isn't right!" + err)
            })
    })
}

module.exports = User