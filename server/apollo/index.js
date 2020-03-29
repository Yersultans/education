import merge from 'lodash/merge'

import auth from './auth'
import user from './user'
import question from './question'
import subject from './subject'
import lesson from './lesson'
import form from './form'
import formMessage from './formMessage'
import post from './post'

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
    formMessage.typeDefs,
    post.typeDefs
  ].join(' '),
  resolvers: merge(
    {},
    user.resolvers,
    auth.resolvers,
    question.resolvers,
    subject.resolvers,
    lesson.resolvers,
    form.resolvers,
    formMessage.resolvers,
    post.resolvers
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
        FormMessage: formMessage.model,
        Post: post.model
      }
    }
  }
}

module.exports = app => {
  const server = new ApolloServer(gqlServerConfig)
  server.applyMiddleware({ app })
}
