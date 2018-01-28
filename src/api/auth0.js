import Auth0 from 'auth0-js'
import config from '@/../auth-config.json'

export const getWebAuth = ({ redirectUri = '/', lang = 'en' }) => {
  return new Auth0.WebAuth({
    domain: config.AUTH0_CLIENT_DOMAIN,
    clientID: config.AUTH0_CLIENT_ID,
    redirectUri: `${window.location.protocol}//${window.location.host}${redirectUri}`,
    // audience: 'https://openmultimedia.auth0.com/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email name',
    nonce: 'openmultimedia',
    options: {
      language: lang
    }
  })
}

export const checkSession = (webAuth) => {
  return new Promise((resolve, reject) => {
    webAuth.checkSession({}, (err, authResult) => {
      if (err) {
        return reject(new Error(err.errorDescription))
      } else if (authResult && authResult.accessToken && authResult.idToken) {
        webAuth.client.userInfo(authResult.accessToken, (err, user) => {
          if (err) {
            return reject(err)
          }
          return resolve({ authResult, user })
        })
      } else {
        return reject(new Error('No auth data'))
      }
    })
  })
}

export const parseSession = (webAuth) => {
  return new Promise((resolve, reject) => {
    if (!window.location.hash) reject(new Error('No sesison data to process'))
    webAuth.parseHash({}, (err, authResult) => {
      if (err) {
        console.log(err, authResult)
        return reject(new Error(err.errorDescription))
      } else if (authResult && authResult.accessToken && authResult.idToken) {
        webAuth.client.userInfo(authResult.accessToken, (err, user) => {
          if (err) {
            return reject(err)
          }
          return resolve({ authResult, user })
        })
      } else {
        return reject(new Error('No auth data'))
      }
    })
  })
}
