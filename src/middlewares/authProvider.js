const {
	oAuthClientID,
	oAuhtClientSecret,
	callbackURL,
	calllbackURLDev,
	fbAppID,
	fbAppSecret,
	ghClientID,
	ghClientSecret,
	production,
} = require("../config")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const FBStrategy = require("passport-facebook").Strategy
const GHStrategy = require("passport-github2").Strategy

const asignCallbackURL = (provider) =>
	`${production ? callbackURL : calllbackURLDev}/api/auth/${provider}/callback`
const getProfile = (accessToken, refreshToken, profile, done) => {
	done(null, {
		profile,
	})
}

const useGoogleStrategy = () => {
	return new GoogleStrategy(
		{
			clientID: oAuthClientID,
			clientSecret: oAuhtClientSecret,
			callbackURL: asignCallbackURL("google"),
		},
		getProfile
	)
}

const useFacebookStrategy = () => {
	return new FBStrategy(
		{
			clientID: fbAppID,
			clientSecret: fbAppSecret,
			callbackURL: asignCallbackURL("facebook"),
			profileFields: [
				"id", "displayName", "photos", "emails"
			],
		},
		getProfile
	)
}

const useGitHubStrategy = () => {
	return new GHStrategy(
		{
			clientID: ghClientID,
			clientSecret: ghClientSecret,
			callbackURL: asignCallbackURL("github"),
			scope: [
				"user:email"
			],
		},
		getProfile
	)
}

module.exports = {
	useGoogleStrategy,
	useFacebookStrategy,
	useGitHubStrategy,
}
