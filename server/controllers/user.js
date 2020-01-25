const mongoose = require("mongoose");

const User = mongoose.model("User");

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
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports.getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports.addUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(200).send(err);
  }
}

module.exports.updateUser = async (req, res) => {
  try { 
    const { userId } = req.params;
    await User.update({_id: userId}, req.body);
    const user = await User.findById(userId);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndRemove(userId);
    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}