const mongoose = require('mongoose')

const User = mongoose.model('User')
const passport = require('passport')
const jwt = require('jsonwebtoken')
const groupHelpers = require('../helpers/group')

const config = require('../config')

const redirect = ({ request, response, path }) => {
  const redirectPath = groupHelpers.isAdminRoutes({ request })
    ? `/${path}`
    : '/'
  return response.redirect(redirectPath)
}

module.exports.registrateUser = async (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        return redirect({ request: req, response: res, path: '/register' })
      }
      passport.authenticate('jwt')(req, res, () => {
        const currentUser = groupHelpers.getCurrentUser({ request: req })
        res.send(currentUser)
      })
      return user
    }
  )
}

module.exports.logout = async (req, res) => {
  req.logout()
  return redirect({ request: req, response: res, path: '/' })
}

module.exports.login = async (req, res) => {
  const { user } = req
  const token = jwt.sign(
    { role: user.role, id: user._id, username: user.username },
    config.SECRET_KEY
  )
  return res.json({ user, token })
}

module.exports.loginAdmin = async (req, res) => {
  try {
    const { user } = req
    if (user.role !== 'admin' && user.role !== 'contentManager') {
      return res.status(401).send('Only admin or teacher can accces')
    }
    const token = jwt.sign(
      { role: user.role, id: user.id, username: user.username },
      config.SECRET_KEY
    )
    return res.json({ user, token })
  } catch (err) {
    console.log('err: ', err)
    return res.status(422).send(err)
  }
}

module.exports.currentUser = async (req, res) => {
  if (!req.user) return res.status(401).send(null)
  const currentUser = groupHelpers.getCurrentUser({ request: req })
  return res.send(currentUser)
}
