const sphereEngine = require('./sphereEngine')
const judge0 = require('./judge0')
const badgeUp = require('./badgeUp')
const socket = require('./socket')

const password = '52turdayk1ds3'
const username = 'saturdaykids'

const mongoDB = {
  defaultEndpoint: `mongodb+srv://yers:W0KJcP4J-@cluster0-re8hh.mongodb.net/education?retryWrites=true&w=majority`,
  prodEndpoint: `mongodb+srv://yers:W0KJcP4J-@cluster0-re8hh.mongodb.net/education?retryWrites=true&w=majority`
}

// const mongoDB = {
//   defaultEndpoint: `mongodb://${username}:${password}@ds241647.mlab.com:41647/saturday-kids-features`
// };

const SECRET_KEY =
  'dkasmdmaskfndjkgnfjdnlsdmejwnrfefjkervfnjkfmklsamdejwkoivnfkkndgsdfo'

const AIRTABLE_API_KEY = 'key9zpFqBLvHoLJmx'

const whitelist = process.env.AllowedUrls
const isDevMode = process.env.NODE_ENV !== 'production'
const isStageMode = process.env.NODE_ENV === 'STAGING'
const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'
const localUrl = 'http://localhost:5001'

const s3 = {
  SECRET_ACCESS_KEY: '84AXxrRICp1XOPPNr4cCWKAm5c7ZUVfDzRiP9jmB',
  ACCESS_KEY_ID: 'AKIA2WUGRGFCGQCOJZFS',
  BUCKET_NAME: 'explorerpass-submission-assets',
  REGION: 'Asia Pacific (Singapore)'
}

const getMongoEndpoint = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return mongoDB.prodEndpoint
    case 'development':
      return mongoDB.defaultEndpoint
    default:
      return mongoDB.defaultEndpoint
  }
}

const config = {
  AIRTABLE_API_KEY,
  SECRET_KEY,
  sphereEngine,
  mongoDB,
  badgeUp,
  s3,
  socket,
  whitelist,
  isDevMode,
  isStageMode,
  isProd,
  isTest,
  getMongoEndpoint,
  localUrl,
  judge0
}

module.exports = config
