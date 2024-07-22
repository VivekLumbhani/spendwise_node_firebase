const admin = require('firebase-admin');
const serviceAccount = require('./config/spendwiseproject-firebase-adminsdk-mjlqr-4eefad7c51.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spendwiseproject-default-rtdb.firebaseio.com"
});

const db = admin.database();
module.exports = db;
