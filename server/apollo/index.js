import merge from 'lodash/merge'

import auth from './auth'
import user from './user'
import question from './question'
import subject from './subject'
import lesson from './lesson'
import form from './form'
import formMessage from './formMessage'

import gqlLoader from './gqlLoader'

const { ApolloServer } = require('apollo-server-express')

const gqlServerConfig = {
  introspection: true,
  playground: true,
  typeDefs: [
    gqlLoader('./index.graphql'),
    user.typeDefs, // comment for multiline
    auth.typeDefs,
    question.typeDefs,
    subject.typeDefs,
    lesson.typeDefs,
    form.typeDefs,
    formMessage.typeDefs
  ].join(' '),
  resolvers: merge(
    {},
    user.resolvers,
    auth.resolvers,
    question.resolvers,
    subject.resolvers,
    lesson.resolvers,
    form.resolvers,
    formMessage.resolvers
  ),
  context: ({ req }) => {
    return {
      user: req.user,
      logout: req.logout,
      models: {
        User: user.model,
        Question: question.model,
        Subject: subject.model,
        Lesson: lesson.model,
        Form: form.model,
        FormMessage: formMessage.model
      }
    }
  }
}

module.exports = app => {
  const server = new ApolloServer(gqlServerConfig)
  server.applyMiddleware({ app })
}
