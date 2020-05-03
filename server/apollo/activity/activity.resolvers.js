module.exports = {
  Query: {
    async activities(_, args, ctx) {
      const activities = await ctx.models.Activity.find({}, 'id')
      return activities
    },
    async activity(_, args, ctx) {
      const activity = await ctx.models.Activity.findById(args.id, 'id').exec()
      if (!activity) {
        throw new Error('Activity does not exist')
      }
      return activity
    }
  },
  Mutation: {
    async addActivity(_, { input }, ctx) {
      const activity = new ctx.models.Activity(input)
      await activity.save()
      return activity
    },
    async updateActivity(_, { id, input }, ctx) {
      const activity = await ctx.models.Activity.findOneAndUpdate(
        { _id: id },
        input,
        { new: true }
      ).exec()
      return activity
    },
    async deleteActivity(_, { id }, ctx) {
      await ctx.models.Activity.findByIdAndRemove(id).exec()
      return id
    }
  },
  Activity: {
    id(Activity) {
      return `${Activity._id}`
    },
    async name(Activity, _, ctx) {
      const item = await ctx.models.Activity.findById(Activity._id, 'name')
      return item.name
    },
    async content(Activity, _, ctx) {
      const item = await ctx.models.Activity.findById(Activity._id, 'content')
      return item.content
    },
    async imageUrl(Activity, _, ctx) {
      const item = await ctx.models.Activity.findById(Activity._id, 'imageUrl')
      return item.imageUrl
    },
    async language(Activity, _, ctx) {
      const item = await ctx.models.Activity.findById(Activity._id, 'language')
      return item.language
    },
    async subject(Activity, _, ctx) {
      const item = await ctx.models.Activity.findById(Activity._id, 'subject')
      return item.subject
    },
    async lesson(Activity, _, ctx) {
      const item = await ctx.models.Activity.findById(Activity._id, 'lesson')
      return item.lesson
    },
    async videoUrl(Activity, _, ctx) {
      const item = await ctx.models.Activity.findById(Activity._id, 'videoUrl')
      return item.videoUrl
    }
  }
}
