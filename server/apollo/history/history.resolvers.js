const fields = '_id user questions correctAnswers total updatedAt created_at'

module.exports = {
  Query: {
    async histories(_, args, ctx) {
      const histories = await ctx.models.History.find({}, fields)
      return histories
    },
    async history(_, args, ctx) {
      const history = await ctx.models.History.findById(args.id, fields).exec()
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
      const result = await ctx.models.History.deleteOne({ _id: id })

      if (result.deletedCount !== 1) {
        throw new Error('History not deleted')
      }

      return id
    }
  },
  History: {
    id(history) {
      return `${history._id}`
    },
    async user(history, _, ctx) {
      const userId = history.user
      if (userId) {
        const user = await ctx.loaders.userLoader.load(userId)
        return user
      }
      return null
    },
    async questions(history, _, ctx) {
      if (!history.questions) return []
      const questions = await ctx.loaders.historyLoader.loadMany(
        history.questions.filter(question => question != null)
      )
      return questions
    }
  }
}
