const mongoDB = {
  defaultEndpoint: `mongodb+srv://yers:W0KJcP4J-@cluster0-re8hh.mongodb.net/education?retryWrites=true&w=majority`,
  prodEndpoint: `mongodb+srv://yers:W0KJcP4J-@cluster0-re8hh.mongodb.net/education?retryWrites=true&w=majority`
}

const SECRET_KEY =
  'dkasmdmaskfndjkgnfjdnlsdmejwnrfefjkervfnjkfmklsamdejwkoivnfkkndgsdfo'

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
  SECRET_KEY,
  mongoDB,
  s3,
  whitelist,
  isDevMode,
  isStageMode,
  isProd,
  isTest,
  getMongoEndpoint,
  localUrl
}

module.exports = config
