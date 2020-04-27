import model from './history.model'
import gqlLoader from '../gqlLoader'
import resolvers from './history.resolvers'

module.exports = {
  typeDefs: gqlLoader('./history/history.graphql'),
  model,
  resolvers
}
