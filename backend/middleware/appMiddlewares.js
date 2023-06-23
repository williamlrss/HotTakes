const rateLimit = require('express-rate-limit');
const cors = require('cors');
const helmet = require('helmet');
// const dompurify = require('dompurify');
const hpp = require('hpp');

const appMiddlewares = (express, app) => {
	app.use(cors());
	app.use(express.json());
	app.use(
		helmet.contentSecurityPolicy({
			directives: {
				'default-src': ["'self'"],
				'img-src': ["'self'", 'data:', 'http://localhost:3000'],
			},
		})
	);
	// app.use(dompurify());
	app.use(hpp());
	const limiter = rateLimit({
		windowMs: 15 * 60 * 1000,
		max: 100,
	});
	app.use(limiter);
};

module.exports = appMiddlewares;
