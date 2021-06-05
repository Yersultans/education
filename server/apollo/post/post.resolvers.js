const fields = '_id name content imageUrl user messages updatedAt created_at'

module.exports = {
  Query: {
    async posts(_, args, ctx) {
      const posts = await ctx.models.Post.find({}, fields)
      return posts
    },
    async post(_, args, ctx) {
      const post = await ctx.models.Post.findById(args.id, fields).exec()
      if (!post) {
        throw new Error('Post does not exist')
      }
      return post
    }
  },
  Mutation: {
    async addPost(_, { input }, ctx) {
      const item = new ctx.models.Post(input)
      await item.save()
      return item
    },
    async updatePost(_, { id, input }, ctx) {
      const item = await ctx.models.Post.findOneAndUpdate({ _id: id }, input, {
        new: true
      }).exec()
      if (!item) {
        throw new Error('Post not found')
      }
      return item
    },
    async deletePost(_, { id }, ctx) {
      const result = await ctx.models.Post.deleteOne({ _id: id })

      if (result.deletedCount !== 1) {
        throw new Error('Post not deleted')
      }

      return id
    }
  },
  Post: {
    id(post) {
      return `${post._id}`
    },
    async user(post, _, ctx) {
      const userId = post.user
      console.log('userId', userId)
      if (userId) {
        const user = await ctx.loaders.userLoader.load(userId)
        return user
      }
      return null
    },
    async messages(post, _, ctx) {
      if (!post.messages) return []
      const messages = await ctx.loaders.fromMessageLoader.loadMany(
        post.messages.filter(message => message != null)
      )
      return messages
    }
  }
}
