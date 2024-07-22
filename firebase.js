const admin = require('firebase-admin');
const moment = require('moment');
const serviceAccount = require('./config/spendwiseproject-firebase-adminsdk-mjlqr-4eefad7c51.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://spendwiseproject-default-rtdb.firebaseio.com"
});

const db = admin.database();

const formatTimestamp = (timestamp) => {
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
};

const fetchAndFormatSMS = async () => {
  try {
    const smsRef = db.ref('sms');
    const formattedSMSRef = db.ref('formatted_sms');
    const snapshot = await smsRef.once('value');
    const smsData = snapshot.val();

    if (!smsData) {
      console.log('No SMS data found.');
      return;
    }

    for (const key in smsData) {
      if (smsData.hasOwnProperty(key)) {
        const sms = smsData[key];

        const formattedTimestamp = formatTimestamp(sms.timestamp);
        const formattedSMS = {
          ...sms,
          formattedTimestamp,
        };
        await formattedSMSRef.child(key).set(formattedSMS);
      }
    }
    console.log('Formatted SMS data saved successfully.');
  } catch (error) {
    console.error('Error fetching and formatting SMS data:', error);
  }
};

fetchAndFormatSMS();
