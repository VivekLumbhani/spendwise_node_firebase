const db = require('./firebase');

async function testDatabaseConnection() {
  try {
    if (!db || typeof db.ref !== 'function') {
      throw new Error('Database reference is not initialized correctly');
    }

    const smsRef = db.ref('sms');
    const snapshot = await smsRef.once('value');
    const smsData = snapshot.val();
    console.log('SMS Data:', smsData);
  } catch (error) {
    console.error('Error fetching SMS data:', error);
  }
}

testDatabaseConnection();
