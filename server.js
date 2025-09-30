// server.js
const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('./')); // serve your HTML files

// Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// API route to handle form submissions
app.post('/api/lead', async (req, res) => {
  try {
    const { name, phone, service, message } = req.body;

    if (!name || !phone || !service || !message) {
      return res.status(400).send('Missing fields');
    }

    const sms =
      `📩 New Web Lead (Coker Plumbing)\n` +
      `Name: ${name}\n` +
      `Phone: ${phone}\n` +
      `Service: ${service}\n` +
      `Message: ${message}`;

    await client.messages.create({
      to: process.env.COKER_TO,
      from: process.env.TWILIO_FROM,
      body: sms,
    });

    res.status(200).send('Message sent');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error sending message');
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
