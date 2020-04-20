module.exports = {
  Query: {
    async forms(_, args, ctx) {
      const forms = await ctx.models.Form.find({}, 'id')
      return forms
    },
    async form(_, args, ctx) {
      const form = await ctx.models.Form.findById(args.id, 'id').exec()
      if (!form) {
        throw new Error('Form does not exist')
      }
      return form
    }
  },
  Mutation: {
    async addForm(_, { input }, ctx) {
      const form = new ctx.models.Form(input)
      await form.save()
      return form
    },
    async updateForm(_, { id, input }, ctx) {
      const form = await ctx.models.Form.findOneAndUpdate({ _id: id }, input, {
        new: true
      }).exec()
      return form
    },
    async deleteForm(_, { id }, ctx) {
      await ctx.models.Form.findByIdAndRemove(id).exec()
      return id
    }
  },
  Form: {
    id(Form) {
      return `${Form._id}`
    },
    async name(Form, _, ctx) {
      const item = await ctx.models.Form.findById(Form._id, 'name')
      return item.name
    },
    async description(Form, _, ctx) {
      const item = await ctx.models.Form.findById(Form._id, 'description')
      return item.description
    },
    async user(Form, _, ctx) {
      const item = await ctx.models.Form.findById(Form._id, 'user')
      return item.user
    },
    async messages(Form, _, ctx) {
      const item = await ctx.models.Form.findById(Form._id, 'messages')
      return item.messages
    },
    async createdAt(Form, _, ctx) {
      const item = await ctx.models.Form.findById(Form._id, 'createdAt')
      return item.createdAt
    },
    async updateAt(Form, _, ctx) {
      const item = await ctx.models.Form.findById(Form._id, 'updateAt')
      return item.updateAt
    }
  }
}
