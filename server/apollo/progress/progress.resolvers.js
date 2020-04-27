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
    }
  },
  Mutation: {
    async addProgresses(_, { input }, ctx) {
      const progresses = input
      const questions = progresses.map(async progress => {
        const question = new ctx.models.Progress(progress)
        await question.save()
        return question._id
      })
      const history = new ctx.models.History({ user: input[0].user, questions })
      await history.save()
      return history
    },
    async addProgress(_, { input }, ctx) {
      const progress = new ctx.models.Progress(input)
      await progress.save()
      return progress
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
    }
  }
}
