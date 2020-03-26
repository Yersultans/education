import model from './lesson.model'
import gqlLoader from '../gqlLoader'
import resolvers from './lesson.resolvers'

module.exports = {
  typeDefs: gqlLoader('./lesson/lesson.graphql'),
  model,
  resolvers
}
