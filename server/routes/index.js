const lessonRoutes = require('./lesson')
const questionRoutes = require('./question')
const subjectRoutes = require('./subject')
const userRoutes = require('./user')
const formRoutes = require('./form')
const formMessageRoutes = require('./formMessage')
const authRoutes = require('./auth')

module.exports = app => {
  app.use('/api', lessonRoutes)
  app.use('/api', questionRoutes)
  app.use('/api', subjectRoutes)
  app.use('/api', userRoutes)
  app.use('/api', formRoutes)
  app.use('/api', formMessageRoutes)
  app.use('/api', authRoutes)
}
