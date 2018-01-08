import Auth0 from 'auth0-js'
// import createPersistedState from 'vuex-persistedstate'

const state = {
  accessToken: null,
  idToken: null,
  expiresIn: null,
  user: null
}

const auth0 = new Auth0.WebAuth({
  domain: 'openmultimedia.auth0.com',
  clientID: 'cq4JJuHvlGsX8D1qsea2AqqYYXwVlUuz',
  redirectUri: location.origin + '/',
  // audience: 'https://openmultimedia.auth0.com/userinfo',
  responseType: 'token id_token',
  scope: 'openid profile email name',
  options: {
    language: 'es'
  }
})

const mutations = {
  AUTH0_LOGIN_SUCCESS: (state, authResult) => {
    state.accessToken = authResult.accessToken
    state.idToken = authResult.idToken
    state.expiresIn = authResult.expiresIn
  },

  AUTH0_LOGOUT: (state) => {
    state.accessToken = null
    state.idToken = null
    state.expiresIn = null
    state.user = null
  },

  AUTH0_SET_USER: (state, user) => {
    state.user = user
  }
}

const actions = {
  login: ({ commit, state }) => {
    // will redirect to auth0
    auth0.authorize()
  },

  logout: ({ commit }) => {
    commit('AUTH0_LOGOUT')
    return Promise.resolve()
  },

// webAuth.parseHash({ hash: window.location.hash }, function(err, authResult) {
//   if (err) {
//     return console.log(err);
//   }

//   webAuth.client.userInfo(authResult.accessToken, function(err, user) {
//     // Now you have the user's information
//   });
// });

  parseSession: ({ commit }) => {
    return new Promise((resolve, reject) => {
      auth0.parseHash({}, (err, authResult) => {
        console.log(err, authResult)
        if (err) {
          return reject(new Error(err.errorDescription))
        } else if (authResult && authResult.accessToken && authResult.idToken) {
          commit('AUTH0_LOGIN_SUCCESS', authResult)
          auth0.client.userInfo(authResult.accessToken, (err, user) => {
            commit('AUTH0_SET_USER', user)
            if (err) {
              console.log(err)
            }
          })
          return resolve()
        } else {
          return reject(new Error('Login required'))
        }
        // console.log(err, authResult)
        // if (authResult && authResult.accessToken && authResult.idToken) {
        // } else if (err) {
        //   console.log(err)
        //   commit('AUTH0_LOGIN_FAILURE', { error: { error: err, message: err.error_description } })
        //   return reject(err)
        // } else {
        //   // commit('AUTH0_LOGIN_FAILURE', { error: { error: err, message: err.error_description } })
        //   return reject(new Error('Unknown error'))
        // }
      })
    })
  },

  auth0RefreshToken: ({ commit, state }) => {
    return new Promise((resolve, reject) => {
      commit('AUTH0_REFRESH_TOKEN_REQUEST')

      auth0.refreshToken(state.refreshToken, (err, result) => {
        if (err) {
          commit('AUTH0_REFRESH_TOKEN_FAILURE', { error: { error: err.details.error, message: err.details.error_description } })
          return reject(err)
        }

        commit('AUTH0_REFRESH_TOKEN_SUCCESS', result)
        resolve()
      })
    })
  },

  Auth0GetProfile: ({ commit, dispatch, state }) => {
    return new Promise((resolve, reject) => {
      if (state.profile) {
        // Do not load profile if it already exists in state.
        return resolve()
      }

      commit('AUTH0_GET_PROFILE_REQUEST')

      auth0.getProfile(state.idToken, (err, profile) => {
        if (err) {
          if (err.error === 401) {
            return dispatch('AUTH0_LOGOUT')
          }

          commit('AUTH0_GET_PROFILE_FAILURE', { error: err })
          return reject(err)
        }

        commit('AUTH0_GET_PROFILE_SUCCESS', { profile })
        return resolve()
      })
    })
  }
}

const getters = {
  isAuthenticated: (state) => !!state.idToken,
  isTokenExpired: (state) => false, // state.idToken && auth0.isTokenExpired(state.idToken)
  userName: (state) => {
    if (state.user) { return state.user.name }
  },
  userPicture: (state) => {
    if (state.user) { return state.user.picture }
  },
  userEmail: (state) => {
    if (state.user) { return state.user.email }
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
