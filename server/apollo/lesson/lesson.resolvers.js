module.exports = {
  Query: {
    async lessons(_, args, ctx) {
      const lessons = await ctx.models.Lesson.find({}, 'id')
      return lessons
    },
    async lesson(_, args, ctx) {
      const lesson = await ctx.models.Lesson.findById(args.id, 'id').exec()
      if (!lesson) {
        throw new Error('Lesson does not exist')
      }
      return lesson
    }
  },
  Mutation: {
    async addLesson(_, { input }, ctx) {
      const lesson = new ctx.models.Lesson(input)
      await lesson.save()
      return lesson
    },
    async updateLesson(_, { id, input }, ctx) {
      const lesson = await ctx.models.Lesson.findOneAndUpdate(
        { _id: id },
        input,
        { new: true }
      ).exec()
      return lesson
    },
    async deleteLesson(_, { id }, ctx) {
      await ctx.models.Lesson.findByIdAndRemove(id).exec()
      return id
    }
  },
  Lesson: {
    id(Lesson) {
      return `${Lesson._id}`
    },
    async name(Lesson, _, ctx) {
      const item = await ctx.models.Lesson.findById(Lesson._id, 'name')
      return item.name
    },
    async content(Lesson, _, ctx) {
      const item = await ctx.models.Lesson.findById(Lesson._id, 'content')
      return item.content
    },
    async imageUrl(Lesson, _, ctx) {
      const item = await ctx.models.Lesson.findById(Lesson._id, 'imageUrl')
      return item.imageUrl
    },
    async language(Lesson, _, ctx) {
      const item = await ctx.models.Lesson.findById(Lesson._id, 'language')
      return item.language
    },
    async subject(Lesson, _, ctx) {
      const item = await ctx.models.Lesson.findById(Lesson._id, 'subject')
      return item.subject
    },
    async videoUrl(Lesson, _, ctx) {
      const item = await ctx.models.Lesson.findById(Lesson._id, 'videoUrl')
      return item.videoUrl
    },
    async activities(Lesson, _, ctx) {
      const item = await ctx.models.Lesson.findById(Lesson._id, 'activities')
      return item.activities
    }
  }
}
