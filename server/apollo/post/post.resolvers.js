module.exports = {
  Query: {
    async posts(_, args, ctx) {
      const posts = await ctx.models.Post.find({}, 'id')
      return posts
    },
    async post(_, args, ctx) {
      const post = await ctx.models.Post.findById(args.id, 'id').exec()
      if (!post) {
        throw new Error('Post does not exist')
      }
      return post
    }
  },
  Mutation: {
    async addPost(_, { input }, ctx) {
      const post = new ctx.models.Post(input)
      await post.save()
      return post
    },
    async updatePost(_, { id, input }, ctx) {
      const post = await ctx.models.Post.findOneAndUpdate({ _id: id }, input, {
        new: true
      }).exec()
      return post
    },
    async deletePost(_, { id }, ctx) {
      await ctx.models.Post.findByIdAndRemove(id).exec()
      return id
    }
  },
  Post: {
    id(Post) {
      return `${Post._id}`
    },
    async name(Post, _, ctx) {
      const item = await ctx.models.Post.findById(Post._id, 'name')
      return item.name
    },
    async content(Post, _, ctx) {
      const item = await ctx.models.Post.findById(Post._id, 'content')
      return item.content
    },
    async imageUrl(Post, _, ctx) {
      const item = await ctx.models.Post.findById(Post._id, 'imageUrl')
      return item.imageUrl
    },
    async user(Post, _, ctx) {
      const item = await ctx.models.Post.findById(Post._id, 'user')
      return item.user
    },
    async messages(Post, _, ctx) {
      const item = await ctx.models.Post.findById(Post._id, 'messages')
      return item.messages
    },
    async createdAt(Post, _, ctx) {
      const item = await ctx.models.Post.findById(Post._id, 'created_at')
      return item.created_at
    },
    async updatedAt(Post, _, ctx) {
      const item = await ctx.models.Post.findById(Post._id, 'updatedAt')
      return item.updatedAt
    }
  }
}
