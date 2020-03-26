const request = require('request')
const config = require('../config')

const isDevMode = process.env.NODE_ENV !== 'production'

const badgeUpKey = isDevMode
  ? config.badgeUp.devApiKey
  : config.badgeUp.prodApiKey

const endPoint = isDevMode
  ? config.badgeUp.endpointDev
  : config.badgeUp.endpointProd
const auth = Buffer.from(`${badgeUpKey}:`).toString('base64')

const headers = {
  Authorization: `Basic ${auth}`,
  'Content-Type': 'application/json'
}

const eventType = {
  lessonFinished: 'lessonfinished'
}

const modifierType = {
  increment: '@inc',
  decrement: '@dec',
  multiply: '@mult',
  divide: '@div',
  set: '@set',
  minimum: '@min',
  maximum: '@max'
}

const BadgeUpService = {
  getWebhooks: () => {
    const options = {
      uri: `${endPoint}webhooks`,
      method: 'GET',
      headers
    }
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (!err && res.statusCode === 200) {
          if (Object.keys(body).length) {
            resolve(JSON.parse(body))
            return
          }
          resolve(body)
        } else {
          reject(err)
        }
      })
    })
  },
  getEarnedAchievements: () => {
    const options = {
      uri: `${endPoint}earnedachievements`,
      method: 'GET',
      headers
    }
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (!err && res.statusCode === 200) {
          resolve(JSON.parse(body))
        } else {
          reject(err)
        }
      })
    })
  },
  getEarnedAchievementsById: subjectId => {
    const options = {
      uri: `${endPoint}earnedachievements?subject=${subjectId}`,
      method: 'GET',
      headers
    }
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (!err && res.statusCode === 200) {
          resolve(JSON.parse(body))
        } else {
          reject(err)
        }
      })
    })
  },
  getAchievementById: achievementId => {
    const options = {
      uri: `${endPoint}achievements/${achievementId}`,
      method: 'GET',
      headers
    }
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (!err && res.statusCode === 200) {
          resolve(JSON.parse(body))
        } else {
          reject(err)
        }
      })
    })
  },
  getAchievements: () => {
    const options = {
      uri: `${endPoint}achievements`,
      method: 'GET',
      headers
    }
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (!err && res.statusCode === 200) {
          resolve(JSON.parse(body))
        } else {
          reject(err)
        }
      })
    })
  },
  getMetricsById: subjectId => {
    const options = {
      uri: `${endPoint}metrics/${subjectId}`,
      method: 'GET',
      headers
    }
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (!err && res.statusCode === 200) {
          resolve(JSON.parse(body))
        } else {
          reject(err)
        }
      })
    })
  },
  getProgress: () => {
    const options = {
      uri: `${endPoint}progress`,
      method: 'GET',
      headers
    }
    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (!err && res.statusCode === 200) {
          resolve(JSON.parse(body))
        } else {
          reject(err)
        }
      })
    })
  },
  createEvent: (subject, key, modifier) => {
    const options = {
      uri: `${endPoint}events?showIncomplete=true`,
      method: 'POST',
      body: JSON.stringify({
        subject,
        key,
        modifier
      }),
      headers
    }

    return new Promise((resolve, reject) => {
      request(options, (err, res, body) => {
        if (!err && res.statusCode >= 200 && res.statusCode < 400) {
          resolve(JSON.parse(body))
        } else {
          console.log('err', err)
          reject(err)
        }
      })
    })
  }
}

module.exports = {
  BadgeUp: BadgeUpService,
  modifierType,
  eventType
}
