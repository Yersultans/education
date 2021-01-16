const fields =
  '_id user question subject lesson userAnswers isCorrect created_at updateAt'

module.exports = {
  Query: {
    async progresses(_, args, ctx) {
      const progresses = await ctx.models.Progress.find({}, fields)
      return progresses
    },
    async progress(_, args, ctx) {
      const progress = await ctx.models.Progress.findById(
        args.id,
        fields
      ).exec()
      if (!progress) {
        throw new Error('Progress does not exist')
      }
      return progress
    },
    async progressByUser(_, args, ctx) {
      const correct = await ctx.models.Progress.find(
        {
          user: args.id,
          isCorrect: true
        },
        fields
      )
      const wrong = await ctx.models.Progress.find(
        {
          user: args.id,
          isCorrect: false
        },
        'id'
      )
      const total = correct.length + wrong.length
      return { total, correct: correct.length, wrong: wrong.length }
    }
  },
  Mutation: {
    async addProgress(_, { input }, ctx) {
      const item = new ctx.models.Progress(input)
      await item.save()
      return item
    },
    async deleteProgress(_, { id }, ctx) {
      const result = await ctx.models.Progress.deleteOne({ _id: id })

      if (result.deletedCount !== 1) {
        throw new Error('Progress not deleted')
      }

      return id
    }
  },
  Progress: {
    id(progress) {
      return `${progress._id}`
    },
    async user(progress, _, ctx) {
      const userId = progress.user
      if (userId) {
        const user = await ctx.loaders.userLoader.load(userId)
        return user
      }
      return null
    },
    async question(progress, _, ctx) {
      const questionId = progress.question
      if (questionId) {
        const question = await ctx.loaders.questionLoader.load(questionId)
        return question
      }
      return null
    },
    async subject(progress, _, ctx) {
      const subjectId = progress.subject
      if (subjectId) {
        const subject = await ctx.loaders.subjectLoader.load(subjectId)
        return subject
      }
      return null
    },
    async lesson(progress, _, ctx) {
      const lessonId = progress.lesson
      if (lessonId) {
        const lesson = await ctx.loaders.lessonLoader.load(lessonId)
        return lesson
      }
      return null
    }
  }
}
