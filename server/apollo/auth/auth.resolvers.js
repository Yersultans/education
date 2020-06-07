import jwt from 'jsonwebtoken'
import config from '../../config'

module.exports = {
  Query: {
    getCurrentUser(_, __, ctx) {
      const { user } = ctx
      if (!user) {
        throw new Error('user is not authenticated')
      }
      return user
    }
  },
  Mutation: {
    async registerUser(_, { input }, ctx) {
      try {
        const { password } = input
        const { User } = ctx.models
        delete input.password
        const user = await User.register(new User(input), password)
        return user
      } catch (err) {
        throw new Error(err)
      }
    },
    async loginUser(_, { input }, ctx) {
      const { username, password } = input
      const { user, error } = await ctx.models.User.authenticate()(
        username,
        password
      )
      if (!user) throw new Error(error)
      const token = jwt.sign(
        { role: user.role, id: user._id, username: user.username },
        config.SECRET_KEY
      )
      return { token }
    },
    async loginAdmin(_, { input }, ctx) {
      const { username, password } = input
      const { user, error } = await ctx.models.User.authenticate()(
        username,
        password
      )
      if (!user) throw new Error(error)
      if (user.role !== 'admin' && user.role !== 'contentManager')
        throw new Error('Only admin or contentManager can accces')
      const token = jwt.sign(
        { role: user.role, id: user._id, username: user.username },
        config.SECRET_KEY
      )
      return { token }
    },
    logout(_, __, ctx) {
      try {
        ctx.logout()
        return { message: 'logout successful', status: 'ok' }
      } catch (err) {
        throw new Error(err)
      }
    }
  }
}
