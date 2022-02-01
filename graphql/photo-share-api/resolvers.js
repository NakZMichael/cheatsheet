const { GraphQLScalarType } = require("graphql");
const { authorizeWithGithub } = require("./libs");
const fetch = require('node-fetch')

const githubAuth = async (parent, { code }, { db }) => {
  let {
    message,
    access_token,
    avatar_url,
    login,
    name,
  } = await authorizeWithGithub({
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code,
  })
  if (message) {
    throw new Error(message)
  }
  let latestUserInfo = {
    name,
    githubLogin: login,
    githubToken:access_token,
    avatar:avatar_url,
  }
  const insetResult = await db
    .collection('users')
    .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true })
  const user = insetResult.ops[0];
  return {user,token:access_token}
}

module.exports = {
  Query: {
    totalPhotos: (parent,args,{db}) => db.collection('phots').estimatedDocumentCount(),
    allPhotos: (parent, args, { db }) => db.collection('photos').find().toArray(),
    totalUsers:(parent,args,{db})=>db.collection('users').estimatedDocumentCount(),
    allUsers: (parent, args, { db }) => db.collection('users').find().toArray(),
    me: (parent,args,{currentUser})=>currentUser,
  },
  Mutation: {
    postPhoto:async function(parent, args, { db, currentUser }) {
      if (!currentUser) {
        throw new Error('only an authorized user can post a photo')
      }
      const newPhoto = {
        ...args.input,
        userID:currentUser.githubLogin,
        created:new Date(),
      }
      const { insertedIds } = await db.collection('photos').insert(newPhoto)
      newPhoto.id = insertedIds[0]
      return newPhoto;
    },
    addFakeUsers: async (root, { count }, { db }) => {
      const randomUserApi = `https://randomuser.me/api/?results=${count}`
      const { results } = await fetch(randomUserApi)
        .then(res => res.json())
      const users = results.map(r => ({
        githubLogin: r.login.username,
        name: `${r.name.first} ${r.name.last}`,
        avatar: r.picture.thumbnail,
        githubToken: r.login.sha1,
      }))
      await db.collection('users').insert(users)
      return users;
    },
    githubAuth,
    fakeUserAuth: async (parent, { githubLogin }, { db }) => {
      const user = await db.collection('users').findOne({ githubLogin })
      if (!user) {
        throw new Error(`Cannot find user with githubLogin ${githubLogin}`)
      }
      return {
        token: user.githubToken,
        user,
      }
    }
  },
  Photo: {
    id: parent => parent.id || parent._id,
    url: parent => `http://yoursite.com/img/${parent._id}.jpg`,
    postedBy: (parent,args,{db})=>db.collection('users').findOne({githubLogin:parent.userID}),
    taggedUsers: parent => tags.filter(tag => tag.photoID === parent.id)
      .map(tag => tag.userID)
      .map(userID => users.find(u=>u.githubLogin === userID))
  },
  User: {
    postedPhotos: parent => {
      return photos.filter(p=>p.githubUser === parent.githubLogin)
    },
    inPhotos: parent => tags
      .filter(tag => tag.userID === parent.id)
      .map(tag => tag.photoID)
      .map(photoID=>photos.find(p=>p.id===photoID))
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTIme',
    description: 'A valid date time value',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast =>ast.value
  })
}
