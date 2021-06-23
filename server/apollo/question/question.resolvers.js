module.exports = {
  Query: {
    async questions(_, args, ctx) {
      const questions = await ctx.models.Question.find({})
      return questions
    },
    async question(_, args, ctx) {
      const question = await ctx.models.Question.findById(args.id).exec()
      if (!question) {
        throw new Error('Question does not exist')
      }
      return question
    },
    async quizby(_, { input }, ctx) {
      const questions = await ctx.models.Question.find({ ...input })
      return questions
    }
  },
  Mutation: {
    async addQuestion(_, { input }, ctx) {
      const item = new ctx.models.Question(input)
      await item.save()
      return item
    },
    async updateQuestion(_, { id, input }, ctx) {
      const item = await ctx.models.Question.findOneAndUpdate(
        { _id: id },
        input,
        {
          new: true
        }
      ).exec()
      return item
    },
    async deleteQuestion(_, { id }, ctx) {
      const result = await ctx.models.Question.deleteOne({ _id: id })

      if (result.deletedCount !== 1) {
        throw new Error('Question not deleted')
      }

      return id
    }
  },
  Question: {
    id(question) {
      return `${question._id}`
    },
    async subject(question, _, ctx) {
      const subjectId = question.subject
      if (subjectId) {
        const subject = await ctx.loaders.subjectLoader.load(subjectId)
        return subject
      }
      return null
    },
    async lesson(question, _, ctx) {
      const lessonId = question.lesson
      if (lessonId) {
        const lesson = await ctx.loaders.lessonLoader.load(lessonId)
        return lesson
      }
      return null
    },
    async activity(question, _, ctx) {
      const activityId = question.activity
      if (activityId) {
        const activity = await ctx.loaders.activityLoader.load(activityId)
        return activity
      }
      return null
    }
  }
}
