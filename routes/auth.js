const express = require('express');
const router = express.Router();
const passport = require('passport');

// @desc    Login/Landing page
// @route   GET /auth/google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// @desc    Google auth callback
// @route   GET /auth/google/callback
router.get(
	'/google/callback',
	passport.authenticate('google', { failureRedirect: '/' }),
	(req, res) => {
		res.redirect('/dashboard'); // successRedirect
	}
);

// @desc    Logout user
// @route   GET /auth/logout
router.get('/logout', (req, res) => {
    req.logout((err) => {
        if(err) res.redirect('/dashboard');
        else res.redirect('/');
    });
})

module.exports = router;
