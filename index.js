const db = require('./firebase');
const moment = require('moment');
const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());



app.get('/getUnFormatted', async (req, res) => {
    try {
        const smsRef = db.ref('sms');
        const snapshot = await smsRef.once('value');
        const smsData = snapshot.val();

        if (!smsData) {
            return res.status(404).json({ message: 'No SMS data found.' });
        }

        res.json(smsData);
    } catch (error) {
        console.error('Error fetching SMS data:', error);
        res.status(500).json({ error: 'Error fetching SMS data.' });
    }
});



app.get('/getFormatted', async (req, res) => {
    try {
        const smsRef = db.ref('formatted_sms');
        const snapshot = await smsRef.once('value');
        const smsData = snapshot.val();

        if (!smsData) {
            return res.status(404).json({ message: 'No SMS data found.' });
        }

        res.json(smsData);
    } catch (error) {
        console.error('Error fetching SMS data:', error);
        res.status(500).json({ error: 'Error fetching SMS data.' });
    }
});

async function testDatabaseConnection() {
    try {


        const smsRef = db.ref('sms');
        const snapshot = await smsRef.once('value');
        const smsData = snapshot.val();
        console.log('SMS Data without formatting:', JSON.stringify(smsData));
    } catch (error) {
        console.error('Error fetching SMS data:', error);
    }
}


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
        return { count: 0, message: 'No SMS data found.' };
      }
  
      let formattedCount = 0;
  
      for (const key in smsData) {
        if (smsData.hasOwnProperty(key)) {
          const sms = smsData[key];
          const formattedTimestamp = formatTimestamp(sms.timestamp);
          const formattedSMS = {
            ...sms,
            formattedTimestamp,
          };
          await formattedSMSRef.child(key).set(formattedSMS);
          formattedCount++;
        }
      }
      console.log(`Formatted SMS data saved successfully. Total formatted: ${formattedCount}`);
      return { count: formattedCount, message: 'Formatted SMS data saved successfully.' };
    } catch (error) {
      console.error('Error fetching and formatting SMS data:', error);
      throw error;
    }
  };
  



  app.get('/makeTheFormat', async (req, res) => {
    try {
      const result = await fetchAndFormatSMS();
      res.json(result);
    } catch (error) {
      console.error('Error formatting SMS data:', error);
      res.status(500).json({ error: 'Error formatting SMS data.' });
    }
  });
  

app.listen(port, () => {
    testDatabaseConnection();
    console.log(`Server is running on http://localhost:${port}`);
});
