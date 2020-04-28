module.exports = {
  Query: {
    async progresses(_, args, ctx) {
      const progresses = await ctx.models.Progress.find({}, 'id')
      return progresses
    },
    async progress(_, args, ctx) {
      const progress = await ctx.models.Progress.findById(args.id, 'id').exec()
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
        'id'
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
      const progress = new ctx.models.Progress(input)
      await progress.save()
      return progress
    },
    async deleteProgress(_, { id }, ctx) {
      await ctx.models.Progress.findByIdAndRemove(id).exec()
      return id
    }
  },
  Progress: {
    id(Progress) {
      return `${Progress._id}`
    },
    async user(Progress, _, ctx) {
      const item = await ctx.models.Progress.findById(Progress._id, 'user')
      return item.user
    },
    async question(Progress, _, ctx) {
      const item = await ctx.models.Progress.findById(Progress._id, 'question')
      return item.question
    },
    async subject(Progress, _, ctx) {
      const item = await ctx.models.Progress.findById(Progress._id, 'subject')
      return item.subject
    },
    async lesson(Progress, _, ctx) {
      const item = await ctx.models.Progress.findById(Progress._id, 'lesson')
      return item.lesson
    },
    async userAnswers(Progress, _, ctx) {
      const item = await ctx.models.Progress.findById(
        Progress._id,
        'userAnswers'
      )
      return item.userAnswers
    },
    async isCorrect(Progress, _, ctx) {
      const item = await ctx.models.Progress.findById(Progress._id, 'isCorrect')
      return item.isCorrect
    }
  }
}
