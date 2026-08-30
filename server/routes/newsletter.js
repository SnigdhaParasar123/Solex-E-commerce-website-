const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const NEWSLETTER_FILE = path.join(__dirname, '../data/newsletter.json');

function readData(file, defaultVal = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2));
      return defaultVal;
    }
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return defaultVal;
  }
}

function writeData(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing newsletter data:', err);
  }
}

router.post('/subscribe', (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  const subscribers = readData(NEWSLETTER_FILE, []);
  if (subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
    return res.json({ message: "You're already subscribed to SOLEX drops!" });
  }

  subscribers.push({
    email: email.trim().toLowerCase(),
    subscribedAt: new Date().toISOString()
  });
  writeData(NEWSLETTER_FILE, subscribers);

  res.json({ message: 'Thank you for subscribing! Check your inbox for exclusive perks & 10% off.' });
});

module.exports = router;
