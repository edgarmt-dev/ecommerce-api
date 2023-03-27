const express = require("express");
const morgan = require("morgan");
const pkg = require("../package.json");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("passport");
const {
  useGoogleStrategy,
  useFacebookStrategy,
  useGitHubStrategy,
} = require("./middlewares/authProvider");
const { jwtSecret } = require("./config");

const app = express();

app.set("pkg", pkg);

// Routes import
const auth = require("./routes/auth");
const user = require("./routes/user");
const cart = require("./routes/cart");
const product = require("./routes/product");
const payments = require("./routes/payments");
const webhooks = require("./routes/webhooks");

// Middlewares
app.use(morgan("dev"));
app.use(
  "/api/webhooks/stripe",
  express.raw({
    type: "application/json",
  })
);
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:5500",
      "https://fixly.vercel.app",
    ],
    credentials: true,
  })
);
app.use(cookieParser(jwtSecret));
app.use(passport.initialize());

// Strategies Auth
passport.use(useFacebookStrategy());
passport.use(useGoogleStrategy());
passport.use(useGitHubStrategy());
passport.serializeUser((user, done) => {
  done(null, user);
});

// Routes
auth(app);
user(app);
cart(app);
product(app);
payments(app);
webhooks(app);

app.get("/", (req, res) => {
  const data = {
    name: app.get("pkg").name,
    version: app.get("pkg").version,
    description: app.get("pkg").description,
    author: app.get("pkg").author,
  };
  return res.json(data);
});

module.exports = app;
