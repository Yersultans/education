const fields = '_id name description user messages created_at  updatedAt'

module.exports = {
  Query: {
    async forms(_, args, ctx) {
      const forms = await ctx.models.Form.find({}, fields)
      return forms
    },
    async form(_, args, ctx) {
      const form = await ctx.models.Form.findById(args.id, fields).exec()
      if (!form) {
        throw new Error('Form does not exist')
      }
      return form
    }
  },
  Mutation: {
    async addForm(_, { input }, ctx) {
      const item = new ctx.models.Form(input)
      await item.save()
      return item
    },
    async updateForm(_, { id, input }, ctx) {
      const item = await ctx.models.Form.findOneAndUpdate({ _id: id }, input, {
        new: true
      }).exec()
      if (!item) {
        throw new Error('Form not found')
      }
      return item
    },
    async deleteForm(_, { id }, ctx) {
      const result = await ctx.models.Hero.deleteOne({ _id: id })

      if (result.deletedCount !== 1) {
        throw new Error('Form not deleted')
      }
      return id
    }
  },
  Form: {
    id(form) {
      return `${form._id}`
    },
    async user(form, _, ctx) {
      const userId = form.user
      if (userId) {
        const user = await ctx.loaders.userLoader.load(userId)
        return user
      }
      return null
    },
    async messages(form, _, ctx) {
      if (!form.messages) return []
      const messages = await ctx.loaders.formMessageLoader.loadMany(
        form.messages.filter(message => message != null)
      )
      return messages
    }
  }
}
