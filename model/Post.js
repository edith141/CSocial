const postsColl = require('../dbase').db().collection('posts')
const ObjectID = require('mongodb').ObjectID
const Post = function (data, userId, requestedPostId) {
    this.data = data
    this.userId = userId
    this.errors = []
    this.requestedPostId = requestedPostId
}

Post.prototype.createPost = function() {
    console.log('going to call prom')
    return new Promise( (resolve, reject) => {
        this.sanitize()
        this.validate()
        console.log('sanitized and validated post')
        if ( this.errors.length == 0 ) {
            //save to db 
            console.log('have a post')
            postsColl.insertOne(this.data)
            .then( () => {
                console.log('saved to db')
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


Post.prototype.update = function () {
    return new Promise(async (resolve, reject) => {
        try {
            let post =  await Post.getOneById(this.requestedPostId, this.userId)
            // if or not
            if (post.isVisitorOwner) {
                //update db
                let status = await this.updateNow()
                resolve(status)
            }
            else {
                reject()
            }
        }
        catch {
            
        }
    })
}

Post.prototype.updateNow = function () {
    return new Promise( async (resolve, reject) => {
        this.sanitize()
        this.validate()
        if (this.errors.length == 0) {
            await postsColl.findOneAndUpdate({_id: new ObjectID(this.requestedPostId)}, {$set: {title: this.data.title, body: this.data.body}})
            resolve("success")
        }
        else {
            resolve("failed")

        }

    })
}



Post.prototype.sanitize = function() {
    this.data.title = String(this.data.title).trim()
    this.data.body = String(this.data.body).trim()
    // this.userID = String(this.userID).trim()


    this.data = {
        title: this.data.title,
        body: this.data.body,
        createdOn: new Date(),
        // author: String(this.userId)
        // author: ObjectID(this.userId)
        author: ObjectID(this.userId)
        // author: this.userId
    }
    console.log(this.userId)
}

Post.prototype.validate = function() {
    if ( this.data.title == "" ) {
        this.errors.push("Can't leave title blank!")
    }
    if ( this.data.body == "" ) {
        this.errors.push("Can't leave body blank!")
    }
}


//duplicate!
Post.postQuery = function(operations, visitorId) {
    return new Promise( async function (resolve, reject) {
        let aggoprs = operations.concat([
            // {$match: {_id: new ObjectID(id)}},
            {$lookup: {from: 'users', localField: "author", foreignField: '_id', as: "docAuthor"}},
            {$project: {
                title: 1, 
                body: 1, 
                createdOn: 1, 
                authorId: "$author",
                author: {$arrayElemAt: ['$docAuthor', 0]}
            }}
        ])
        let posts = await postsColl.aggregate(aggoprs).toArray()

        //remove creds
        posts = posts.map( (aPost) => {
            aPost.isVisitorOwner = aPost.authorId.equals(visitorId)
            aPost.author = {
                username: aPost.author.username
            }

            return aPost
        })

        resolve(posts)
    })
}




Post.getOneById = function(id, visitorId) {
    return new Promise( async function (resolve, reject) {
        if (typeof(id) != 'string' || !ObjectID.isValid(id)) {
            reject()
            return
        }
        
        let posts = await Post.postQuery([
            {$match: {_id: new ObjectID(id)}}
            // {$match: {_id: id}}
        ], visitorId)

        if (posts.length) {
            console.log(posts[0])
            resolve(posts[0])
        }

        else {
            reject()
        }
    })
}
// Post.getOneById = function(id) {
//     return new Promise( async function (resolve, reject) {
//         if (typeof(id) != 'string' || !ObjectID.isValid(id)) {
//             reject()
//             return
//         }
//         let posts = await postsColl.aggregate([
//             {$match: {_id: new ObjectID(id)}},
//             {$lookup: {from: 'users', localField: "author", foreignField: '_id', as: "docAuthor"}},
//             {$project: {
//                 title: 1, 
//                 body: 1, 
//                 createdOn: 1, 
//                 author: {$arrayElemAt: ['$docAuthor', 0]}
//             }}
//         ]).toArray()

//         //remove creds
//         posts = posts.map( (aPost) => {
//             aPost.author = {
//                 username: aPost.author.username
//             }

//             return aPost
//         })

//         if (posts.length) {
//             console.log(posts[0])
//             resolve(posts[0])
//         }

//         else {
//             reject()
//         }
//     })
// }



Post.getPostByUserId = (userID) => {
    return Post.postQuery([
        {$match: {author: userID}},
        {$sort: {createdOn: -1}}
    ])
}

module.exports = Post