import model from './formMessage.model'
import gqlLoader from '../gqlLoader'
import resolvers from './formMessage.resolvers'
import loader from './formMessage.loader'

module.exports = {
  typeDefs: gqlLoader('./formMessage/formMessage.graphql'),
  model,
  resolvers,
  loader
}
