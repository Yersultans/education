import model from './form.model'
import gqlLoader from '../gqlLoader'
import resolvers from './form.resolvers'

module.exports = {
  typeDefs: gqlLoader('./form/form.graphql'),
  model,
  resolvers
}
