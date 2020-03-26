const mongoose = require('mongoose')

const User = mongoose.model('User')
const { BadgeUp, modifierType } = require('../services/BadgeUp')
const { validationResult } = require('express-validator/check')

const generateUserName = async username => {
  const isUnique = await User.find({ username })
  if (isUnique.length === 0) {
    return username
  }
  const lastChar = Number.parseInt(username[username.length - 1], 0)
  if (Number.isNaN(lastChar)) {
    return generateUserName(username + 1)
  }
  return generateUserName(
    `${username.slice(0, username.length - 1)}${lastChar + 1}`
  )
}

module.exports.getUsers = async (req, res) => {
  try {
    const {
      sortByWupai,
      populateSchool,
      role,
      page,
      limit,
      userName,
      name,
      schoolId
    } = req.query
    const pageSizeLimit = Number(limit)
    const queryOptions = Object.assign(
      {},
      sortByWupai && { sort: { wupai: sortByWupai } },
      populateSchool && { populate: { path: 'school', select: 'name' } },
      limit && { limit: pageSizeLimit || 10 },
      page && { page: page || 0 }
    )

    const searchOptions = Object.assign(
      {},
      userName && { username: { $regex: new RegExp(`^${userName}`, 'i') } },
      name && { name: { $regex: new RegExp(`^${name}`, 'i') } },
      schoolId && { school: schoolId },
      role && { role }
    )
    const findedUsers = await User.paginate(searchOptions, queryOptions)

    const users = {
      ...findedUsers,
      docs: role
        ? findedUsers.docs.filter(user => user.role === role)
        : findedUsers.docs
    }

    if (typeof sortByWupai !== 'undefined') {
      users.docs = users.docs.map(user => {
        const greaterDocmentCount = users.docs.filter(
          ({ wupai }) => wupai > user.wupai
        ).length
        const queryPage = Number(page || 0)
        const offsetNumber = (queryPage || 1) - 1
        const offset = offsetNumber * (Number(limit) || 10)
        const position = greaterDocmentCount + offset + 1
        return { ...user.toObject(), position }
      })
    }

    res.status(200).send(users)
  } catch (err) {
    console.log('error: ', err)
    res.status(500).send({ err })
  }
}

module.exports.getUser = async (req, res) => {
  try {
    console.log('req: ', req.params)
    const { userId } = req.params
    if (!userId) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    } else {
      const user = await User.findById(userId)
      res.status(200).send(user)
    }
  } catch (err) {
    res.status(500).send({ err })
  }
}

module.exports.addUser = async (req, res) => {
  try {
    const errors = validationResult(req).array()
    console.log('errors ', errors)
    if (errors && errors.length > 0) {
      res.status(400).send(errors)
    }
    const { password, username, ...userProps } = req.body
    const uniqueUsername = await generateUserName(username)
    User.register(
      new User({ username: uniqueUsername, ...userProps }),
      password,
      (err, user) => {
        if (err) {
          res.status(422).send(err)
        }
        res.status(200).send(user)
        return user
      }
    )
  } catch (err) {
    console.log(err)
    res.status(500).send({ err })
  }
}

module.exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId)
    await User.update({ _id: userId }, req.body)
    res.status(200).send(user)
  } catch (err) {
    console.log(err)
    res.status(500).send({ err })
  }
}

module.exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    } else {
      const user = await User.findById(userId)
      const result = await User.findByIdAndRemove(userId)
      res.status(200).send(result)
    }
  } catch (err) {
    res.status(500).send({ err })
  }
}

module.exports.setPassword = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    } else {
      const user = await User.findById(req.params.userId)
      const sanitizedUser = await user.setPassword(req.body.password)
      await sanitizedUser.save()
      res.status(200).send(sanitizedUser)
    }
  } catch (err) {
    res.status(500).send({ err })
  }
}

module.exports.socialAchievements = async (req, res) => {
  try {
    const { userId, socialType } = req.body
    await BadgeUp.createEvent(userId, socialType, {
      [modifierType.increment]: 1
    })
    res.status(200).send('Badge added successfully!')
  } catch (err) {
    console.log(err)
    res.status(500).send({ err })
  }
}

module.exports.getUserRank = async (req, res) => {
  try {
    const { userId } = req.params
    if (!userId) {
      res.status(400).send({ err: 'Данные не отправлены!' })
    } else {
      const user = await User.findById(userId)
      if (!user) {
        res.status(400).send('User not found')
        return
      }

      const { wupai } = user
      const rankPosition = await User.distinct('wupai').count({
        wupai: { $gt: wupai }
      })
      const userWithRank = { ...user.toObject(), position: rankPosition + 1 }
      res.status(200).send(userWithRank)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send({ err })
  }
}

module.exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.params
    const users = await User.find({ role })
    res.status(200).send(users)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}
module.exports.getSchoolAdmins = async (req, res) => {
  try {
    const schoolAdmins = await User.find({ role: 'schoolAdmin' })
    res.status(200).send(schoolAdmins)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}
module.exports.getSchoolUsersBySchoolId = async (req, res) => {
  try {
    const { schoolId } = req.params
    const schoolUsers = await User.find({
      role: 'schoolUser',
      school: schoolId
    })
    res.status(200).send(schoolUsers)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.getSchoolTeachersBySchoolId = async (req, res) => {
  try {
    const { schoolId } = req.params
    const schoolUsers = await User.find({
      role: 'teacher',
      school: schoolId
    })
    res.status(200).send(schoolUsers)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

module.exports.getSchoolUsersByClassId = async (req, res) => {
  try {
    const { classId } = req.params
    const schoolUsers = await User.find({ schoolClass: classId })
    res.status(200).send(schoolUsers)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}
