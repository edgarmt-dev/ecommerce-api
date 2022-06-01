require('dotenv').config()

const config = {
    production: process.env.NODE_ENV === 'production',
    development: process.env.NODE_ENV === 'development',
    port: process.env.PORT,
    dbUsername: process.env.DB_USERNAME,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbName: process.env.DB_NAME,
    jwtSecret: process.env.JWT_SECRET,
    oAuthClientID: process.env.OAUTH_CLIENT_ID,
    oAuhtClientSecret: process.env.OAUTH_CLIENT_SECRET,
    fbAppID: process.env.FACEBOOK_APP_ID,
    fbAppSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    calllbackURLDev: process.env.CALLBACK_URL_DEV
}

module.exports = config