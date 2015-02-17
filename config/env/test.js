'use strict';

module.exports = {
	db: process.env.MONGO_URL +'/airtv-test' || 'mongodb://db/airtv-test',
	port: 3001,
	app: {
		title: 'airtv - test'
	}
};
