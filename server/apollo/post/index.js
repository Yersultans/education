import model from './post.model'
import gqlLoader from '../gqlLoader'
import resolvers from './post.resolvers'

module.exports = {
  typeDefs: gqlLoader('./post/post.graphql'),
  model,
  resolvers
}
