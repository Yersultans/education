import model from './progress.model'
import gqlLoader from '../gqlLoader'
import resolvers from './progress.resolvers'

module.exports = {
  typeDefs: gqlLoader('./progress/progress.graphql'),
  model,
  resolvers
}
