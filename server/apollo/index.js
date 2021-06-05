import merge from 'lodash/merge'

import auth from './auth'
import user from './user'
import question from './question'
import subject from './subject'
import lesson from './lesson'
import activity from './activity'
import form from './form'
import formMessage from './formMessage'
import post from './post'
import progress from './progress'
import history from './history'

import gqlLoader from './gqlLoader'
import formMessageModel from './formMessage/formMessage.model'

const { GraphQLScalarType } = require('graphql')

const { ApolloServer } = require('apollo-server-express')

const resolverMap = {
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A date and time, represented as an ISO-8601 string',
    serialize: value => value.toISOString(),
    parseValue: value => new Date(value),
    parseLiteral: ast => new Date(ast.value)
  })
}

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
    activity.typeDefs,
    form.typeDefs,
    formMessage.typeDefs,
    post.typeDefs,
    progress.typeDefs,
    history.typeDefs
  ].join(' '),
  resolvers: merge(
    {},
    user.resolvers,
    auth.resolvers,
    question.resolvers,
    subject.resolvers,
    lesson.resolvers,
    activity.resolvers,
    form.resolvers,
    formMessage.resolvers,
    post.resolvers,
    progress.resolvers,
    history.resolvers,
    resolverMap
  ),
  context: ({ req }) => {
    return {
      user: req.user,
      logout: req.logout,
      loaders: {
        userLoader: user.loader,
        activityLoader: activity.loader,
        formLoader: form.loader,
        formMessageLoader: formMessage.loader,
        historyLoader: history.loader,
        lessonLoader: lesson.loader,
        postLoader: post.loader,
        progressLoader: progress.loader,
        questionLoader: question.loader,
        subjectLoader: subject.loader
      },
      models: {
        User: user.model,
        Question: question.model,
        Subject: subject.model,
        Lesson: lesson.model,
        Activity: activity.model,
        Form: form.model,
        FormMessage: formMessage.model,
        Post: post.model,
        Progress: progress.model,
        History: history.model
      }
    }
  }
}

module.exports = app => {
  const server = new ApolloServer(gqlServerConfig)
  server.applyMiddleware({ app })
}
