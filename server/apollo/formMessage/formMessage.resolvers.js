const fields = '_id content user messages post form updatedAt created_at'

module.exports = {
  Query: {
    async formMessages(_, args, ctx) {
      const formMessages = await ctx.models.FormMessage.find({}, fields)
      return formMessages
    },
    async formMessage(_, args, ctx) {
      const formMessage = await ctx.models.FormMessage.findById(
        args.id,
        fields
      ).exec()
      if (!formMessage) {
        throw new Error('FormMessage does not exist')
      }
      return formMessage
    }
  },
  Mutation: {
    async addFormMessage(_, { input }, ctx) {
      const item = new ctx.models.FormMessage(input)
      await item.save()
      return item
    },
    async updateFormMessage(_, { id, input }, ctx) {
      const item = await ctx.models.FormMessage.findOneAndUpdate(
        { _id: id },
        input,
        {
          new: true
        }
      ).exec()
      if (!item) {
        throw new Error('FormMessage not found')
      }
      return item
    },
    async deleteFormMessage(_, { id }, ctx) {
      const result = await ctx.models.FormMessage.deleteOne({ _id: id })

      if (result.deletedCount !== 1) {
        throw new Error('FormMessage not deleted')
      }

      return id
    }
  },
  FormMessage: {
    id(formMessage) {
      return `${formMessage._id}`
    },
    async user(formMessage, _, ctx) {
      const userId = formMessage.user
      if (userId) {
        const user = await ctx.loaders.userLoader.load(userId)
        return user
      }
      return null
    },
    async messages(formMessage, _, ctx) {
      if (!formMessage.messages) return []
      const messages = await ctx.loaders.formMessageLoader.loadMany(
        formMessage.messages.filter(message => message != null)
      )
      return messages
    },
    async post(formMessage, _, ctx) {
      const postId = formMessage.post
      if (postId) {
        const post = await ctx.loaders.postLoader.load(postId)
        return post
      }
      return null
    },
    async form(formMessage, _, ctx) {
      const formId = formMessage.post
      if (formId) {
        const form = await ctx.loaders.formLoader.load(formId)
        return form
      }
      return null
    }
  }
}
