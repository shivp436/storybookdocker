const express = require('express');
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../middleware/auth');
const Story = require('../models/Story');

// @desc    Login/Landing page

// @route   GET /
router.get('/', forwardAuthenticated, (req, res) => {
    res.render('login', {
        layout: 'login' // layout:login is the name of the handlebars file specific to the login page
    });
});

// @desc    Dashboard
router.get('/dashboard', ensureAuthenticated , async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id }).lean(); // lean is a mongoose method that converts the mongoose object to a plain javascript object
        res.render('dashboard', {
            fName: req.user.firstName,
            stories
        });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    } 
});

module.exports = router;