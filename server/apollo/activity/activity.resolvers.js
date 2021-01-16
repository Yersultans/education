const fields =
  '_id user event station program status group identifier exercise created_at updated_at'

module.exports = {
  Query: {
    async activities(_, args, ctx) {
      const activities = await ctx.models.Activity.find({}, fields)
      return activities
    },
    async activity(_, args, ctx) {
      const activity = await ctx.models.Activity.findById(
        args.id,
        fields
      ).exec()
      if (!activity) {
        throw new Error('Activity does not exist')
      }
      return activity
    }
  },
  Mutation: {
    async addActivity(_, { input }, ctx) {
      const item = new ctx.models.Activity(input)
      await item.save()
      return item
    },
    async updateActivity(_, { id, input }, ctx) {
      const item = await ctx.models.Activity.findOneAndUpdate(
        { _id: id },
        input,
        { new: true }
      ).exec()
      if (!item) {
        throw new Error('Activity not found')
      }
      return item
    },
    async deleteActivity(_, { id }, ctx) {
      const result = await ctx.models.Activity.deleteOne({ _id: id })

      if (result.deletedCount !== 1) {
        throw new Error('Activity not deleted')
      }

      return id
    }
  },
  Activity: {
    id(activity) {
      return `${activity._id}`
    },
    async subject(activity, _, ctx) {
      const subjectId = activity.subject
      if (subjectId) {
        const subject = await ctx.loaders.subjectLoader.load(subjectId)
        return subject
      }
      return null
    },
    async lesson(activity, _, ctx) {
      const lessonId = activity.lesson
      if (lessonId) {
        const lesson = await ctx.loaders.lessonLoader.load(lessonId)
        return lesson
      }
      return null
    }
  }
}
