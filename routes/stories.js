const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middleware/auth');
const Story = require('../models/Story');

// @desc    Show stories add page
// @route   GET /stories/add
router.get('/add', ensureAuthenticated, (req, res) => {
	res.render('stories/add');
});

// @desc    Process add form
// @route   POST /stories
router.post('/', ensureAuthenticated, async (req, res) => {
	try {
		req.body.user = req.user.id;
		await Story.create(req.body);
		res.redirect('/dashboard');
	} catch (err) {
		console.error(err);
		res.render('error/500');
	}
});

// @desc    Show all stories
// @route   GET /stories
router.get('/', ensureAuthenticated, async (req, res) => {
	try {
		const stories = await Story.find({ status: 'public' })
			.populate('user') // populate() is a mongoose method that allows us to reference documents in other collections
			.sort({ createdAt: 'desc' })
			.lean();
		res.render('stories/index', { stories });
	} catch (err) {
		console.error(err);
		res.render('error/500');
	}
});

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuthenticated, async (req, res) => {
	try {
		const story = await Story.findOne({ _id: req.params.id })
			.populate('user')
			.lean();
		if (!story) {
			return res.render('error/404');
		}
		res.render('stories/show', { story });
	} catch (err) {
		console.error(err);
		res.render('error/500');
	}
});

// @desc    Show edit page
// @route   GET /stories/edit/:id
router.get('/edit/:id', ensureAuthenticated, async (req, res) => {
	try {
		const story = await Story.findOne({ _id: req.params.id }).lean();
		if (!story) {
			return res.render('error/404');
		}
		if (story.user != req.user.id) {
			res.redirect('/stories');
		} else {
			res.render('stories/edit', { story });
		}
	} catch {
		console.error(err);
		return res.render('error/500');
	}
});

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuthenticated, async (req, res) => {
	try {
		let story = await Story.findOne({ _id: req.params.id }).lean();

		if (!story) {
			return res.render('error/404');
		}

		if (story.user != req.user.id) {
			res.redirect('/stories');
		} else {
			story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
				// findOneAndUpdate({query}, {update}, {options})
				new: true, // returns the updated document
				runValidators: true, // runs the required validators on the update
			});
			res.redirect('/dashboard');
		}
	} catch (err) {
		console.error(err);
		return res.render('error/500');
	}
});

// @desc Delete Story
// @route DELETE stories/:id
router.delete('/:id', ensureAuthenticated, async (req, res) => {
    try {
        let story = await Story.findOne({ _id: req.params.id }).lean();

		if (!story) {
			return res.render('error/404');
		}

		if (story.user != req.user.id) {
			res.redirect('/stories');
		} else {
            await Story.findByIdAndRemove(req.params.id);
            res.redirect('/dashboard');
        }
    } catch (err) {
        console.error(err);
        return res.render('error/500');
    }
});

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuthenticated, async (req, res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public',
        })
            .populate('user')
            .lean();
        res.render('stories/index', { stories });
    } catch (err) {
        console.error(err);
        res.render('error/500');
    }
});

module.exports = router;
