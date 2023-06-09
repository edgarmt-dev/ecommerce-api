require("dotenv").config();

const config = {
  production: process.env.NODE_ENV === "production",
  development: process.env.NODE_ENV === "development",
  port: process.env.PORT,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbName: process.env.DB_NAME,
  jwtSecret: process.env.JWT_SECRET,
  stripePK: process.env.STRIPE_PK,
  stripeSK: process.env.STRIPE_SK,
  paypalClientID: process.env.PAYPAL_CLIENT_ID,
  paypalClientSecret: process.env.PAYPAL_CLIENT_SECRET,
  mercadopagoPublicKey: process.env.MERCADOPAGO_PUBLIC_KEY,
  mercadopagoAccessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
  oAuthClientID: process.env.OAUTH_CLIENT_ID,
  oAuhtClientSecret: process.env.OAUTH_CLIENT_SECRET,
  ghClientID: process.env.GITHUB_CLIENT_ID,
  ghClientSecret: process.env.GITHUB_CLIENT_SECRET,
  fbAppID: process.env.FACEBOOK_APP_ID,
  fbAppSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.CALLBACK_URL,
  calllbackURLDev: process.env.CALLBACK_URL_DEV,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUINARY_API_SECRET,
};

module.exports = config;
