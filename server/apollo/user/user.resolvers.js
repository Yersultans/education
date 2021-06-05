import { ApolloError } from 'apollo-server-express'

module.exports = {
  Query: {
    async users(_, args, ctx) {
      const users = await ctx.models.User.find({}, 'id')
      return users
    },
    async user(_, args, ctx) {
      const item = await ctx.models.User.findById(args.id, 'id').exec()
      if (!item) {
        throw new Error('User does not exist')
      }
      return item
    },
    async userbyrole(_, args, ctx) {
      const users = await ctx.models.User.find({ role: args.role })
      return users
    }
  },
  Mutation: {
    async addUser(_, { input }, ctx) {
      try {
        const { User } = ctx.models
        const { password } = input
        delete input.password
        console.log('input', input)
        const user = await User.register(new User(input), password)
        return user
      } catch (err) {
        if (err) {
          if (err.name === 'MongoError' && err.code === 11000) {
            // duplicate username or email
            throw new ApolloError('User already exists')
          }
          throw new ApolloError(err)
        }
      }
    },
    async updateUser(_, { id, input }, ctx) {
      const { password } = input
      delete input.password
      const user = await ctx.models.User.findOneAndUpdate({ _id: id }, input, {
        new: true
      }).exec()
      if (password) {
        const sanitizedUser = await user.setPassword(password)
        await sanitizedUser.save()
      }
      return user
    },
    async deleteUser(_, { id }, ctx) {
      await ctx.models.User.findByIdAndRemove(id).exec()
      return id
    }
  },
  User: {
    id(user) {
      return `${user._id}`
    },
    async username(user, _, ctx) {
      const item = await ctx.models.User.findById(user._id, 'username')
      return item.username
    },
    async password(user, _, ctx) {
      const item = await ctx.models.User.findById(user._id, 'password')
      return item.password
    },
    async firstName(user, _, ctx) {
      const item = await ctx.models.User.findById(user._id, 'firstName')
      return item.firstName
    },
    async lastName(user, _, ctx) {
      const item = await ctx.models.User.findById(user._id, 'lastName')
      return item.lastName
    },
    async name(user, _, ctx) {
      const item = await ctx.models.User.findById(
        user._id,
        'firstName lastName'
      )
      return item.name
    },
    async parentEmail(user, _, ctx) {
      const item = await ctx.models.User.findById(user._id, 'parentEmail')
      return item.parentEmail
    },
    async birthDate(user, _, ctx) {
      const item = await ctx.models.User.findById(user._id, 'birthDate')
      return item.birthDate
    },
    async role(user, _, ctx) {
      const item = await ctx.models.User.findById(user._id, 'role')
      return item.role
    },
    async imageUrl(user, _, ctx) {
      const item = await ctx.models.User.findById(user._id, 'imageUrl')
      return item.imageUrl
    }
  }
}
