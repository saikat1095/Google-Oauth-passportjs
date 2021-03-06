// const path = require("path");
const express = require("express");
const profileRoutes = require("./routes/profile-routes");
const passport = require("passport");
const passportSetup = require("./config/passport.setup");
const mongoose = require("mongoose");
const keys = require("./config/keys");
const cookieSession = require("cookie-session");

const authRoutes = require("./routes/auth-routes");
const app = express();
// set up static folder
app.use(express.static(__dirname + "/public"));

// connect to mongodb
mongoose.connect(
  keys.mongodb.dbURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Connected To mongo db");
  }
);

// set up view engine
app.set("view engine", "ejs");

// setting up cookie-session.
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey],
  })
);

// initialize passport.
app.use(passport.initialize());
app.use(passport.session());

// set up routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

// create home route
app.get("/", (req, res) => {
  res.render("home", {
    user: req.user,
  });
});

app.listen(3000, () => {
  console.log("App Now listening for requests on port 3000");
});
