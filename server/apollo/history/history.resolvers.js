module.exports = {
  Query: {
    async histories(_, args, ctx) {
      const histories = await ctx.models.History.find({}, 'id')
      return histories
    },
    async history(_, args, ctx) {
      const history = await ctx.models.History.findById(args.id, 'id').exec()
      if (!history) {
        throw new Error('History does not exist')
      }
      return history
    },
    async historyByUser(_, args, ctx) {
      const histories = await ctx.models.History.find({ user: args.id }, 'id')
      return histories
    }
  },
  Mutation: {
    async addHistory(_, { input }, ctx) {
      const { answers, total, correctAnswers } = input
      const questions = await Promise.all(
        answers.map(async progress => {
          const question = await ctx.models.Progress.create(progress)
          return question._id
        })
      )
      const history = await ctx.models.History.create({
        user: answers[0].user,
        questions,
        total,
        correctAnswers
      })
      return history
    },
    async deleteHistory(_, { id }, ctx) {
      await ctx.models.History.findByIdAndRemove(id).exec()
      return id
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
    async correctAnswers(History, _, ctx) {
      const item = await ctx.models.History.findById(
        History._id,
        'correctAnswers'
      )
      return item.correctAnswers
    },
    async total(History, _, ctx) {
      const item = await ctx.models.History.findById(History._id, 'total')
      return item.total
    },
    async createdAt(History, _, ctx) {
      const item = await ctx.models.History.findById(History._id, 'created_at')
      return item.created_at
    },
    async updatedAt(History, _, ctx) {
      const item = await ctx.models.History.findById(History._id, 'updatedAt')
      return item.updatdeAt
    }
  }
}
