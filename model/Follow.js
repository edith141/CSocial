const usersColl = require('../dbase').db().collection('users')
const followsColl = require('../dbase').db().collection('follows')
const ObjectID = require('mongodb').ObjectId

let Follow = function (followedUsername, authorId) {

    this.followedUsername = followedUsername
    this.authorId = authorId
    this.errors = []

}

Follow.prototype.sanitize = function () {
    if (typeof(this.followedUsername) != 'string') {
        this.followedUsername = ''
    }
}

Follow.prototype.validate = async function () {
    let followedAcc = await usersColl.findOne({username: this.followedUsername})

    if (followedAcc) {
        this.followedId = followedAcc._id
    }
    else {
        this.errors.push("Can't follow someone who isn't registered!")
    }
}


Follow.prototype.create = function () {
    return new Promise(async (resolve, reject) => {
        this.sanitize()
        await this.validate()

        if (this.errors.length != 0) {
            await followsColl.insertOne({followedId: this.followedId, authorId: new ObjectID(this.authorId)})
            resolve()
        }

    })
}

module.exports = Follow