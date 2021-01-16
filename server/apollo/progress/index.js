import model from './progress.model'
import gqlLoader from '../gqlLoader'
import resolvers from './progress.resolvers'
import loader from './progress.loader'

module.exports = {
  typeDefs: gqlLoader('./progress/progress.graphql'),
  model,
  resolvers,
  loader
}
