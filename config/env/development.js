'use strict';

module.exports = {
	db: process.env.MONGO_URL +'/airtv-dev' || 'mongodb://db/airtv-dev',
	app: {
		title: 'airtv - dev'
	}
};
