import model from './subject.model'
import gqlLoader from '../gqlLoader'
import resolvers from './subject.resolvers'
import loader from './subject.loader'

module.exports = {
  typeDefs: gqlLoader('./subject/subject.graphql'),
  model,
  resolvers,
  loader
}
