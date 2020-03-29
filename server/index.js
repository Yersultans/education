import express from 'express'
import mongoose from 'mongoose'
import session from 'express-session'
import connectMongo from 'connect-mongo'
import path from 'path'
import secure from 'express-force-https'
import cors from 'cors'
import expressValidator from 'express-validator'
import passport from 'passport'
import bodyParser from 'body-parser'
import socket from 'socket.io'
import corsOptions from './helpers/corsOptions'
import config from './config'
import apollo from './apollo'

const app = express()
const MongoStore = connectMongo(session)
const io = socket()

const mongoUrl = config.getMongoEndpoint()
mongoose.connect(mongoUrl, { useNewUrlParser: true, useFindAndModify: false })

app.use(cors(corsOptions))
app.use(bodyParser.json({ limit: '50mb' }))
app.use(expressValidator())
app.use(
  session({
    secret: 'sdfkjasklfdhakjlsfhksad',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { secure: false }
  })
)
app.use(secure)

// authorization
require('./config/passport')(passport)

app.use(passport.initialize())
app.use(passport.session())

require('./routes')(app)

/** ********************* Configure static files ********************** */
console.log('STAGING: ', config.isStageMode, process.env.NODE_ENV)
console.log('PROD: ', config.isProd)
if (config.isStageMode || config.isDevMode) {
  app.use((req, res, next) => {
    next()
  })
}

if (config.isProd || config.isStageMode) {
  /* Admin */
  const adminPath = path.join(__dirname, '..', 'admin', 'build')
  const adminPathIndexFile = path.join(
    __dirname,
    '..',
    'admin',
    'build',
    'index.html'
  )

  app.use('/public/', express.static(adminPath))
  app.get('/login', (_, res) => res.sendFile(adminPathIndexFile))
  app.get('/register', (_, res) => res.sendFile(adminPathIndexFile))
  app.get('/', (_, res) => res.sendFile(adminPathIndexFile))
  app.get('/*', (_, res) => res.sendFile(adminPathIndexFile))
}

app.use('/graphql', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, function(err, user, info) {
    if (user) req.user = user
    if (err) {
      return next(err)
    }
    return next()
  })(req, res, next)
})

apollo(app)

const PORT = process.env.PORT || 5001

const server = app.listen(PORT, () => {
  console.log(`Ready on port: ${PORT}`)
})

io.attach(server)

export default app
