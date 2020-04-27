module.exports = {
  Query: {
    async histories(_, args, ctx) {
      const histories = await ctx.models.History.find({}, 'id')
      return histories
    },
    async history(_, args, ctx) {
      const history = await ctx.models.History.find(
        { userId: args.id },
        'id'
      ).exec()
      if (!history) {
        throw new Error('History does not exist')
      }
      return history
    }
  },
  History: {
    id(History) {
      return `${History._id}`
    },
    async user(History, _, ctx) {
      const item = await ctx.models.History.findById(History._id, 'user')
      return item.user
    },
    async questions(History, _, ctx) {
      const item = await ctx.models.History.findById(History._id, 'questions')
      return item.questions
    },
    async createdAt(History, _, ctx) {
      const item = await ctx.models.History.findById(History._id, 'created_at')
      return item.createdAt
    },
    async updateAt(History, _, ctx) {
      const item = await ctx.models.History.findById(History._id, 'updateAt')
      return item.updateAt
    }
  }
}
