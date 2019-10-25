const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const path = require("path");
const secure = require("express-force-https");
const config = require("./config");
const io = require("socket.io")();
const cors = require("cors");
const expressValidator = require("express-validator");

const app = express();
const passport = require("passport");
const bodyParser = require("body-parser");
const corsOptions = require("./helpers/corsOptions");


require("./models");

const mongoUrl = config.getMongoEndpoint();
mongoose.connect(mongoUrl, { useNewUrlParser: true });

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: "50mb" }));
//app.use(expressValidator());
app.use(
  session({
    secret: "sdfkjasklfdhakjlsfhksad",
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { secure: false }
  })
);
app.use(secure);

require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());

require("./routes")(app);

console.log("STAGING: ", config.isStageMode, process.env.NODE_ENV);
console.log("PROD: ", config.isProd);
if (config.isStageMode || config.isDevMode) {
  app.use((req, res, next) => {
    next();
  });
}

if (config.isProd || config.isStageMode) {
  /* Admin */
  const adminPath = path.join(__dirname, "..", "admin", "build");
  const adminPathIndexFile = path.join(
    __dirname,
    "..",
    "admin",
    "build",
    "index.html"
  );

  app.use("/public/", express.static(adminPath));
  app.get("/login", (_, res) => res.sendFile(adminPathIndexFile));
  app.get("/register", (_, res) => res.sendFile(adminPathIndexFile));
  app.get("/", (_, res) => res.sendFile(adminPathIndexFile));
  app.get("/*", (_, res) => res.sendFile(adminPathIndexFile));
}

const PORT = process.env.PORT || 5001;

const server = app.listen(PORT, () => {
  console.log(`Ready on port: ${PORT}`);
});

io.attach(server);
