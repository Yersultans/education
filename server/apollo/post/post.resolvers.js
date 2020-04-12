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
      await ctx.models.post.findByIdAndRemove(id).exec()
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
    async createdAt(Post, _, ctx) {
      const item = await ctx.models.Post.findById(Post._id, 'createdAt')
      return item.createdAt
    },
    async updateAt(Post, _, ctx) {
      const item = await ctx.models.Post.findById(Post._id, 'updateAt')
      return item.updateAt
    }
  }
}
