'use strict';

module.exports = {
<<<<<<< Updated upstream
	db: 'mongodb://localhost/airtv-dev',
=======
	db: process.env.MONGO_URL +'/airtv-dev' || 'mongodb://db/airtv-dev',
>>>>>>> Stashed changes
	app: {
		title: 'airtv - dev'
	},
	mailer: {
		from: process.env.MAILER_FROM || 'MAILER_FROM',
		options: {
			service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
			auth: {
				user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
				pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
			}
		}
	}
};
