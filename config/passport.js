const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

module.exports = function (passport) {
	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: '/auth/google/callback',
			},
			async (accessToken, refreshToken, profile, cb) => { // data is returned from google
				// accessToken is used to access the Google API on the user's behalf
				// refreshToken is used to refresh the accessToken
				const newUser = {
					googleId: profile.id,
					displayName: profile.displayName,
					firstName: profile.name.givenName,
					lastName: profile.name.familyName,
					image: profile.photos[0].value,
				};

				try {
					let user = await User.findOne({ googleId: profile.id });

					if (user) {
						cb(null, user);
					} else {
						user = await User.create(newUser); // create a new user in the database
						cb(null, user); // pass the user object to the callback function
					}
				} catch (err) {
					console.error(err);
				}
			}
		)
	);

	passport.serializeUser((user, cb) => {
		process.nextTick(() =>
			cb(null, { id: user.id, username: user.username, name: user.name })
		);
		// this is the user object that gets passed to the deserializeUser function
	});

	passport.deserializeUser(async (idObj, cb) => {
		// idObj is the object that was passed to the serializeUser function
		try {
			const user = await User.findOne({ _id: idObj.id });
			process.nextTick(() => cb(null, user)); // this is the user object that gets attached to the request object as req.user
		} catch (err) {
			console.error(err);
		}
	});
};
