import model from './activity.modal'
import gqlLoader from '../gqlLoader'
import resolvers from './activity.resolvers'

module.exports = {
  typeDefs: gqlLoader('./activity/activity.graphql'),
  model,
  resolvers
}
