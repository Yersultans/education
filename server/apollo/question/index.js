import model from './question.model'
import gqlLoader from '../gqlLoader'
import resolvers from './question.resolvers'

module.exports = {
  typeDefs: gqlLoader('./question/question.graphql'),
  model,
  resolvers
}
