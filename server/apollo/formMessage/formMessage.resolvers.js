module.exports = {
  Query: {
    async formMessages(_, args, ctx) {
      const formMessages = await ctx.models.FormMessage.find({}, 'id')
      return formMessages
    },
    async formMessage(_, args, ctx) {
      const formMessage = await ctx.models.FormMessage.findById(
        args.id,
        'id'
      ).exec()
      if (!formMessage) {
        throw new Error('FormMessage does not exist')
      }
      return formMessage
    }
  },
  Mutation: {
    async addFormMessage(_, { input }, ctx) {
      const form = new ctx.models.FormMessage(input)
      await form.save()
      return form
    },
    async updateFormMessage(_, { id, input }, ctx) {
      const formMessage = await ctx.models.FormMessage.findOneAndUpdate(
        { _id: id },
        input,
        {
          new: true
        }
      ).exec()
      return formMessage
    },
    async deleteFormMessage(_, { id }, ctx) {
      await ctx.models.FormMessage.findByIdAndRemove(id).exec()
      return id
    }
  },
  FormMessage: {
    id(FormMessage) {
      return `${FormMessage._id}`
    },
    async user(FormMessage, _, ctx) {
      const item = await ctx.models.FormMessage.findById(
        FormMessage._id,
        'user'
      )
      return item.user
    },
    async content(FormMessage, _, ctx) {
      const item = await ctx.models.FormMessage.findById(
        FormMessage._id,
        'content'
      )
      return item.content
    },
    async messages(FormMessage, _, ctx) {
      const item = await ctx.models.FormMessage.findById(
        FormMessage._id,
        'messages'
      )
      return item.messages
    },
    async createdAt(FormMessage, _, ctx) {
      const item = await ctx.models.FormMessage.findById(
        FormMessage._id,
        'createdAt'
      )
      return item.createdAt
    },
    async updateAt(FormMessage, _, ctx) {
      const item = await ctx.models.FormMessage.findById(
        FormMessage._id,
        'updateAt'
      )
      return item.updateAt
    }
  }
}
