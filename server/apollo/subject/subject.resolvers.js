const fields = '_id name imageUrl language description price lessons'

module.exports = {
  Query: {
    async subjects(_, args, ctx) {
      const subjects = await ctx.models.Subject.find({}, fields)
      return subjects
    },
    async subject(_, args, ctx) {
      const subject = await ctx.models.Subject.findById(args.id, fields).exec()
      if (!subject) {
        throw new Error('Subject does not exist')
      }
      return subject
    },
    async subjectsBy(_, { input }, ctx) {
      const subjects = await ctx.models.Subject.find({ ...input })
      return subjects
    }
  },
  Mutation: {
    async addSubject(_, { input }, ctx) {
      const item = new ctx.models.Subject(input)
      await item.save()
      return item
    },
    async updateSubject(_, { id, input }, ctx) {
      const item = await ctx.models.Subject.findOneAndUpdate(
        { _id: id },
        input,
        {
          new: true
        }
      ).exec()
      return item
    },
    async deleteSubject(_, { id }, ctx) {
      const result = await ctx.models.Question.deleteOne({ _id: id })

      if (result.deletedCount !== 1) {
        throw new Error('Subject not deleted')
      }

      return id
    }
  },
  Subject: {
    id(subject) {
      return `${subject._id}`
    },
    async lessons(subject, _, ctx) {
      if (!subject.lessons) return []
      const lessons = await ctx.loaders.lessonLoader.loadMany(
        subject.lessons.filter(lesson => lesson != null)
      )
      return lessons
    }
  }
}
