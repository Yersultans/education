const express = require("express");

const router = express.Router();

const { getUsers, getUser, addUser, updateUser, deleteUser } = require("../controllers/user");

router.get("/users", getUsers);
router.get("/users/:userId", getUser);
router.post("/users", addUser);
router.post("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

module.exports = router;