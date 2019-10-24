const passport = require("passport");

const isAdminRoutes = ({ request }) =>
  request.get("Referer") && request.get("Referer").includes("admin");

const getCurrentUser = ({ request }) => {
  if (isAdminRoutes({ request })) {
    const user =
      request.user &&
      (request.user.role === "admin" || request.user.role === "reviewer")
        ? request.user
        : null;

    return user;
  }
  return request.user;
};

const requireAdmin = [
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    if (req.user && req.user.role !== "admin") {
      return res.status(403).send("Permission denied");
    }

    return next();
  }
];

const requireReviewer = [
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    if (req.user && req.user.role !== "reviewer") {
      return res.status(403).send("Permission denied");
    }

    return next();
  }
];


const requireUser = [passport.authenticate("jwt", { session: false })];

const requireOnOfRole = roles => [
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).send("Unauthorized");
    }

    const isValidRole = Boolean(
      roles.filter(role => req.user.role === role).length
    );

    if (!isValidRole) {
      return res.status(403).send("Permission denied");
    }

    return next();
  }
];

module.exports = {
  getCurrentUser,
  isAdminRoutes,
  requireAdmin,
  requireOnOfRole,
  requireReviewer,
  requireUser
};
