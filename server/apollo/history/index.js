import model from './history.model'
import gqlLoader from '../gqlLoader'
import resolvers from './history.resolvers'
import loader from './history.loader'

module.exports = {
  typeDefs: gqlLoader('./history/history.graphql'),
  model,
  resolvers,
  loader
}
