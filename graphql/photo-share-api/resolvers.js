const { GraphQLScalarType } = require("graphql");

module.exports = {
  Query: {
    totalPhotos: (parent,args,{db}) => db.collection('phots').estimatedDocumentCount(),
    allPhotos: (parent, args, { db }) => db.collection('photos').find().toArray(),
    totalUsers:(parent,args,{db})=>db.collection('users').estimatedDocumentCount(),
    allUsers: (parent,args,{db})=>db.collection('users').find().toArray(),
  },
  Mutation: {
    postPhoto(parent, args) {
      const newPhoto = {
        id: _id++,
        created:new Date(),
        ...args.input,
      }
      photos.push(newPhoto);
      return newPhoto;
    }
  },
  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`,
    postedBy: parent => users.find(u => u.githubLogin === parent.githubUser),
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