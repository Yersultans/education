import model from './formMessage.model'
import gqlLoader from '../gqlLoader'
import resolvers from './formMessage.resolvers'

module.exports = {
  typeDefs: gqlLoader('./formMessage/formMessage.graphql'),
  model,
  resolvers
}
