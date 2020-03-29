module.exports = {
  Query: {
    async subjects(_, args, ctx) {
      const subjects = await ctx.models.Subject.find({}, 'id')
      return subjects
    },
    async subject(_, args, ctx) {
      const subject = await ctx.models.Subject.findById(args.id, 'id').exec()
      if (!subject) {
        throw new Error('Lesson does not exist')
      }
      return subject
    }
  },
  Mutation: {
    async addSubject(_, { input }, ctx) {
      const subject = new ctx.models.Subject(input)
      await subject.save()
      return subject
    },
    async updateSubject(_, { id, input }, ctx) {
      const subject = await ctx.models.Subject.findOneAndUpdate(
        { _id: id },
        input,
        { new: true }
      ).exec()
      return subject
    },
    async deleteSubject(_, { id }, ctx) {
      await ctx.models.Subject.findByIdAndRemove(id).exec()
      return id
    }
  },
  Subject: {
    id(Subject) {
      return `${Subject._id}`
    },
    async name(Subject, _, ctx) {
      const item = await ctx.models.Subject.findById(Subject._id, 'name')
      return item.name
    },
    async imageUrl(Subject, _, ctx) {
      const item = await ctx.models.Subject.findById(Subject._id, 'imageUrl')
      return item.imageUrl
    },
    async language(Subject, _, ctx) {
      const item = await ctx.models.Subject.findById(Subject._id, 'language')
      return item.language
    },
    async lessons(Subject, _, ctx) {
      const item = await ctx.models.Subject.findById(Subject._id, 'lessons')
      return item.lessons
    }
  }
}
