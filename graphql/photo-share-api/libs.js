
   
const fetch = require('node-fetch')
const fs = require('fs')

const requestGithubToken = credentials => fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept:'application/json',
    },
    body: JSON.stringify(credentials),
  })
    .then(res => res.json())
    .catch(error => {
      throw new Error(JSON.stringify(error))
    })

const requestGithubUserAccount = token => fetch(`http://api.github.com/user`, {
  headers: {
    Authorization: `token ${token}`
  }
})
  .then(res=>res.json())
  .catch(error => { throw new Error(JSON.stringify(error)) })

const authorizeWithGithub = async (credentials) => {
  const { access_token,...others } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return {...githubUser,access_token}
}

module.exports = {
  authorizeWithGithub,
}