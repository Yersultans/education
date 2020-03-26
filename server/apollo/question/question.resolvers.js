module.exports = {
  Query: {
    async questions(_, args, ctx) {
      const questions = await ctx.models.Question.find({}, 'id')
      return questions
    },
    async question(_, args, ctx) {
      const question = await ctx.models.Question.findById(args.id, 'id').exec()
      if (!question) {
        throw new Error('Question does not exist')
      }
      return question
    }
  },
  Mutation: {
    async addQuestion(_, { input }, ctx) {
      const question = new ctx.models.Question(input)
      await question.save()
      return question
    },
    async updateQuestion(_, { id, input }, ctx) {
      const question = await ctx.models.Question.findOneAndUpdate(
        { _id: id },
        input,
        {
          new: true
        }
      ).exec()
      return question
    },
    async deleteQuestion(_, { id }, ctx) {
      await ctx.models.Question.findByIdAndRemove(id).exec()
      return id
    }
  },
  Question: {
    id(Question) {
      return `${Question._id}`
    },
    async text(Question, _, ctx) {
      const item = await ctx.models.Question.findById(Question._id, 'text')
      return item.text
    },
    async level(Question, _, ctx) {
      const item = await ctx.models.Question.findById(Question._id, 'level')
      return item.level
    },
    async options(Question, _, ctx) {
      const item = await ctx.models.Question.findById(Question._id, 'options')
      return item.options
    },
    async correctAnswers(Question, _, ctx) {
      const item = await ctx.models.Question.findById(
        Question._id,
        'correctAnswers'
      )
      return item.correctAnswers
    },
    async isMultipleAnswers(Question, _, ctx) {
      const item = await ctx.models.Question.findById(
        Question._id,
        'isMultipleAnswers'
      )
      return item.isMultipleAnswers
    }
  }
}
