const usersColl = require('../dbase').db().collection('users')
const validator = require('validator')
const crypt = require('bcryptjs')


let User = function (data) {
    this.data = data
    this.errors = []
}

User.prototype.userNameIsUnique = async function () {
    if (this.errors.length == 0) {
        let auser = await usersColl.findOne({ username: this.data.username })
        // console.log('if true')
        if (auser) {
            console.log('user found')
            this.errors.push("This username is already taken.")
            // console.log("" + this.errors + 'from found!')
            // console.log(this.errors)
        }
    }
}
User.prototype.emailIsUnique = async function () {
    if (this.errors.length == 0) {
        let auser = await usersColl.findOne({ email: this.data.email })
        // console.log('if true')
        if (auser) {
            // console.log('user found')
            this.errors.push("This email is already taken.")
            // console.log("" + this.errors + 'from found!')
            // console.log(this.errors)
        }
    }
}
User.prototype.sanitize = function () {
    //stop mallicious code from being submitted

    this.data = {
        username: "" + this.data.username + "".trim(),
        email: "" + this.data.email + "".trim(),
        password: "" + this.data.password
    }

    //redundant?
    if (typeof (this.data.username) != 'string') {
        this.data.username = String(this.data.username)
    }
    if (typeof (this.data.password) != 'string') {
        this.data.password = String(this.data.password)
    }
    if (typeof (this.data.email) != 'string') {
        this.data.email = String(this.data.email)
    }
}

User.prototype.validate = async function () {

    // if (validator.isAlphanumeric(this.data.username) && this.data.username.length > 5 && this.data.username.length < 12) {
    //     console.log('if true')
    //     let auser = await usersColl.findOne({ username: this.data.username })
    //     if (auser) {
    //         console.log('user found')
    //         this.errors.push("LALALA")
    //         console.log("" + this.errors + 'from found!')
    //         // console.log(this.errors)
    //     }
    // }
    //ValidSignUp?
    if (!validator.isAlphanumeric(this.data.username) && (this.data.username.length < 5 || this.data.username.length > 12)) {
        this.errors.push(this.data.username + "Username must be 5-12 char long & can't have special characters.")
    }
    // if (this.data.username.length < 5 || this.data.username.length > 12 ) {
    //     this.errors.push("not a valid username. Should be between 5 and 12 char")
    // }
    if (!validator.isEmail(this.data.email)) {
        this.errors.push("not a valid email address.")
    }
    // if (this.data.password == "") {
    //     this.errors.push(this.data.username + "is not a valid username")
    // }
    if (this.data.password == "" || this.data.password.length < 9 || this.data.username.length > 36) {
        this.errors.push("A password should be between 9 and 36 characters.")
    }

    //if valid, check if it is unique.
   
}

// User.prototype.register = function () {
//     //UserData safe & valid?
//     this.sanitize()
//     this.validate()

//     //then save it
//     if (this.errors.length == 0) {
//         //hash the password before storing in db
//         let salt = crypt.genSaltSync(10)
//         this.data.password = crypt.hashSync(this.data.password, salt)
//         usersColl.insertOne(this.data)
//     }
// }
User.prototype.register = function () {
    //UserData safe & valid?
    this.sanitize()
    this.validate()

    //then save it
    return new Promise((resolved, rejected) => {
        if (this.errors.length == 0) {
            //hash the password before storing in db
            let salt = crypt.genSaltSync(10)
            this.data.password = crypt.hashSync(this.data.password, salt)
            usersColl.insertOne(this.data, function (error, response) {
                if(error) {
                    rejected('Error occurred while inserting');
                   // return 
                } else {
                   resolved(response.ops[0]);
                  // return 
                }
            })
        }
    })
    
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
                        console.log(currUser._id)
                        resolved(currUser)
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


User.getUserByUserName = function(userName) {
    return new Promise(function (resolve, reject) {
        if (typeof(userName) != 'string' ) {
            //if someone tries to pass something other than a str
            reject('Something Fisfy Here!')
            return
        }

        usersColl.findOne({username: userName})
        .then( (userDoc) => {
            //if user found
            if (userDoc) {
                userDoc = new User(userDoc)
                userDoc = {
                    _id: userDoc.data._id,
                    username: userDoc.data.username
                }
                resolve(userDoc)
            }
            else {
                reject()
            }
        })
        .catch( () => {
            reject('UhOh!')
        })
    })
}

module.exports = User