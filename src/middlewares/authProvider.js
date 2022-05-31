const { oAuthClientID, oAuhtClientSecret, callbackURL, production, calllbackURLDev } = require('../config')

const GoogleStrategy = require('passport-google-oauth20').Strategy

const useGoogleStrategy = () => {
    return new GoogleStrategy({
        clientID: oAuthClientID,
        clientSecret: oAuhtClientSecret,
        callbackURL: `${production ? callbackURL : calllbackURLDev}/api/auth/google/callback`,
    }, (accessToken, refreshToken, profile, done) => {
        done(null, { profile })
    })
}

module.exports = { useGoogleStrategy }