const express = require("express");

const router = express.Router();

const passport = require("passport");

const {
  registrateUser,
  login,
  loginAdmin,
  logout,
  currentUser
} = require("../controllers/auth");

const groupHelpers = require("../helpers/group");

router.post("/auth/register", registrateUser);
router.get("/auth/logout", logout);
router.post(
  "/auth/login",
  groupHelpers.requireOnOfRole(["admin"]),
  passport.authenticate("local", { session: false }),
  login
);
router.post(
  "/auth/loginAdmin",
  passport.authenticate("local", { session: false }),
  loginAdmin
);
router.get(
  "/auth/current_user",
  passport.authenticate("jwt", { session: false }),
  currentUser
);

module.exports = router;
