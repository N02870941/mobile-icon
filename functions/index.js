const functions = require('firebase-functions');
const app = require('./api/app');

exports.api = functions.https.onRequest(app);
