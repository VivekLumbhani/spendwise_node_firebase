const db = require('./firebase');
const moment = require('moment');

const formatTimestamp = (timestamp) => {
  return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
};

const fetchAndFormatSMS = async () => {
  try {
    const smsRef = db.ref('sms');
    const formattedSMSRef = db.ref('formatted_sms');
    const snapshot = await smsRef.once('value');
    const smsData = snapshot.val();

    for (const key in smsData) {
      const sms = smsData[key];
      const formattedTimestamp = formatTimestamp(sms.timestamp);
      const formattedSMS = {
        ...sms,
        formattedTimestamp,
      };
      await formattedSMSRef.child(key).set(formattedSMS);
    }
    console.log('Formatted SMS data saved successfully.');
  } catch (error) {
    console.error('Error fetching and formatting SMS data:', error);
  }
};

fetchAndFormatSMS();
