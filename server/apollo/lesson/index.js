import model from './lesson.model'
import gqlLoader from '../gqlLoader'
import resolvers from './lesson.resolvers'
import loader from './lesson.loader'

module.exports = {
  typeDefs: gqlLoader('./lesson/lesson.graphql'),
  model,
  resolvers,
  loader
}
