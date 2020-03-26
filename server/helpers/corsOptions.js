const config = require('../config')

const corsOptions = {
  preflightContinue: true,
  origin(origin, callback) {
    // same origin
    if (!origin) return callback(null, true)

    if (Array.isArray(config.whitelist) && config.whitelist.includes(origin)) {
      return callback(null, true)
    }

    if (`${origin}`.localeCompare(`${config.whitelist}`))
      return callback(null, true)

    return callback(new Error('Not allowed by CORS'))
  }
}

module.exports = corsOptions
