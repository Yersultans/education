import model from './subject.model'
import gqlLoader from '../gqlLoader'
import resolvers from './subject.resolvers'

module.exports = {
  typeDefs: gqlLoader('./subject/subject.graphql'),
  model,
  resolvers
}
