const postsColl = require('../dbase').db().collection('posts')
const ObjectID = require('mongodb').ObjectID
const Post = function (data, userId) {
    this.data = data
    this.userId = userId
    this.errors = []
}

Post.prototype.createPost = function() {
    return new Promise( (resolve, reject) => {
        this.sanitize()
        this.validate()
        if ( this.errors.length == 0 ) {
            //save to db 
            postsColl.insertOne(this.data)
            .then( () => {
                resolve()
            })
            .catch( () => {
                this.errors.push("UhOh! Something doesn't seem right here. Please try again in some time.")
                reject(this.errors)
            })
        }
        else {
            reject(this.errors)
        }
    } )

    
}

Post.prototype.sanitize = function() {
    this.data.title = String(this.data.title).trim()
    this.data.body = String(this.data.body).trim()
    // this.userID = String(this.userID).trim()


    this.data = {
        title: this.data.title,
        body: this.data.body,
        createdOn: new Date(),
        author: ObjectID(this.userId)
    }
}

Post.prototype.validate = function() {
    if ( this.data.title == "" ) {
        this.errors.push("Can't leave title blank!")
    }
    if ( this.data.body == "" ) {
        this.errors.push("Can't leave body blank!")
    }
}


Post.getOneById = function(id) {
    return new Promise( async function (resolve, reject) {
        if (typeof(id) != 'string' || !ObjectID.isValid(id)) {
            reject()
            return
        }
        let posts = await postsColl.aggregate([
            {$match: {_id: new ObjectID(id)}},
            {$lookup: {from: 'users', localField: "author", foreignField: '_id', as: "docAuthor"}},
            {$project: {
                title: 1, 
                body: 1, 
                createdOn: 1, 
                author: {$arrayElemAt: ['$docAuthor', 0]}
            }}
        ]).toArray()

        //remove creds
        posts = posts.map( (aPost) => {
            aPost.author = {
                username: aPost.author.username
            }

            return aPost
        })

        if (posts.length) {
            console.log(posts[0])
            resolve(posts[0])
        }

        else {
            reject()
        }
    })
}
module.exports = Post