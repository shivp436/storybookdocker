// Importing modules
const path = require('path');
const methodOverride = require('method-override'); // allows us to use PUT and DELETE methods in our forms
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');

// load config
dotenv.config({ path: './config/config.env' });

// Passport config
require('./config/passport')(passport);

// connect to database
connectDB();

// Initialize express
const app = express();

// Body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method override
app.use(
	methodOverride(function (req, res) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			// look in urlencoded POST bodies and delete it
			var method = req.body._method;
			delete req.body._method;
			return method;
		}
	})
);

// Logging
if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'));
}

// Sessions Middleware
app.use(
	session({
		secret: 'furry cat',
		resave: false,
		saveUninitialized: false,
		// cookie: { secure: true } // only works with https
		store: MongoStore.create({
			mongoUrl: process.env.MONGO_URI,
		}),
	})
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.authenticate('session'));

// Global variables
app.use(function (req, res, next) {
	res.locals.user = req.user || null; // this is the user object from passport, which is stored in req.user, or null if there is no user
	// res.locals.user is a global variable that can be accessed in any template
	next();
});

// Handlebars - Helpers
const {
	formatDate,
	stripTags,
	truncate,
	editIcon,
	select,
} = require('./helpers/hbs');

// Handlebars - view engine
app.engine(
	'.hbs',
	exphbs.engine({
		helpers: { formatDate, stripTags, truncate, editIcon, select },
		defaultLayout: 'main',
		extname: '.hbs',
	})
); // exphbs.engine() returns a function
app.set('view engine', '.hbs');

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/stories', require('./routes/stories'));

// Server
PORT = process.env.PORT || 3000;
app.listen(
	PORT,
	console.log(
		`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`
	)
);
