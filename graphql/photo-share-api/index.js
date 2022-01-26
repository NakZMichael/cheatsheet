const { gql, ApolloServer } = require("apollo-server-express");
const express = require("express");
const expressPlayground = require('graphql-playground-middleware-express').default;
const { readFileSync } = require('fs')
const resolvers = require('./resolvers')
const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
require('dotenv').config()
const {MongClient, MongoClient} = require('mongodb')


let _id = 0;
const users = [
  { "githubLogin": "mHattrup", "name":"Mike Hattrup"},
  { "githubLogin": "gPlake", "name":"Glen Plake"},
  { "githubLogin": "sScmidt", "name":"Scot Schmidt"},
]
const photos = [
  {
    "id": "1",
    "name": "Dropping the Heart Chute",
    "description": "The heart chute is one of my favorite chutes",
    "githubUser": "gPlake",
    "category": "SELFIE",
    "created": "3-28-1997",

  },
  {
    "id": "2",
    "name": "Dropping the Heart Chute",
    "description": "The heart chute is one of my favorite chutes",
    "githubUser": "gPlake",
    "category": "SELFIE",
    "created":"1-2-1985",
  },
  {
    "id": "3",
    "name": "Dropping the Heart Chute",
    "description": "The heart chute is one of my favorite chutes",
    "githubUser": "gPlake",
    "category": "SELFIE",
    "created": "2018-04-15T19:09:57.308Z",
  },
];
const tags = [
  {
    "photoID":"1",
    "userID":"GPlake",
  },
  {
    "photoID":"2",
    "userID":"GPlake",
  },
  {
    "photoID":"2",
    "userID":"GPlake",
  },
  {
    "photoID":"2",
    "userID":"GPlake",
  },
]

async function start(typeDefs, resolvers) {
  const MONGO_DB = process.env.DB_HOST;
  const client = await MongoClient.connect(
    MONGO_DB,
    {useNewUrlParser:true}
  )
  const db = client.db();
  const context = {db}
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });
  await server.start();
  server.applyMiddleware({ app });
  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));
  app.get('/playground',expressPlayground({endpoint:'/graphql'}))
  app.listen({ port: 4000 }, () => {
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`)
  })
}

start(typeDefs,resolvers)