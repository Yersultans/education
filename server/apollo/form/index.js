import model from './form.model'
import gqlLoader from '../gqlLoader'
import resolvers from './form.resolvers'
import loader from './form.loader'

module.exports = {
  typeDefs: gqlLoader('./form/form.graphql'),
  model,
  resolvers,
  loader
}
