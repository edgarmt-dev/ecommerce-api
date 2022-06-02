const { oAuthClientID,
    oAuhtClientSecret,
    callbackURL,
    calllbackURLDev,
    fbAppID,
    fbAppSecret,
    production,
} = require('../config')

const GoogleStrategy = require('passport-google-oauth20').Strategy
const FBStrategy = require('passport-facebook').Strategy

const asignCallbackURL = (provider) => `${production ? callbackURL : calllbackURLDev}/api/auth/${provider}/callback`

const useGoogleStrategy = () => {
    return new GoogleStrategy({
        clientID: oAuthClientID,
        clientSecret: oAuhtClientSecret,
        callbackURL: asignCallbackURL('google'),
    }, (accessToken, refreshToken, profile, done) => {
        done(null, { profile })
    })
}

const useFacebookStrategy = () => {
    return new FBStrategy({
        clientID: fbAppID,
        clientSecret: fbAppSecret,
        callbackURL: asignCallbackURL('facebook'),
        profileFields: ['id', 'displayName', 'photos', 'emails']
    }, (accessToken, refreshToken, profile, done) => {
        done(null, { profile })
    })
}

module.exports = { useGoogleStrategy, useFacebookStrategy }