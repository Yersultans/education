const fields = '_id name content imageUrl language subject videoUrl activities'

module.exports = {
  Query: {
    async lessons(_, args, ctx) {
      const lessons = await ctx.models.Lesson.find({}, fields)
      return lessons
    },
    async lesson(_, args, ctx) {
      const lesson = await ctx.models.Lesson.findById(args.id, fields).exec()
      if (!lesson) {
        throw new Error('Lesson does not exist')
      }
      return lesson
    }
  },
  Mutation: {
    async addLesson(_, { input }, ctx) {
      const item = new ctx.models.Lesson(input)
      await item.save()
      return item
    },
    async updateLesson(_, { id, input }, ctx) {
      const item = await ctx.models.Lesson.findOneAndUpdate(
        { _id: id },
        input,
        { new: true }
      ).exec()
      if (!item) {
        throw new Error('Lesson not found')
      }
      return item
    },
    async deleteLesson(_, { id }, ctx) {
      const result = await ctx.models.Lesson.deleteOne({ _id: id })

      if (result.deletedCount !== 1) {
        throw new Error('Lesson not deleted')
      }

      return id
    }
  },
  Lesson: {
    id(lesson) {
      return `${lesson._id}`
    },
    async subject(lesson, _, ctx) {
      const subjectId = lesson.subject
      if (subjectId) {
        const subject = await ctx.loaders.subjectLoader.load(subjectId)
        return subject
      }
      return null
    },
    async activities(lesson, _, ctx) {
      if (!lesson.activities) return []
      const activities = await ctx.loaders.activityLoader.loadMany(
        lesson.activities.filter(activity => activity != null)
      )
      return activities
    }
  }
}
