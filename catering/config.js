e.p// server.js — Node.js + Express example
// Install dependencies: express, body-parser, nodemailer, helmet, cors

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({ origin: 'https://empire.plutusai.io/catering' }));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

app.post('/submit-order', async (req, res) => {
  const { fullName, phNum, email, orderDetails, partySize, address, date, time } = req.body;
  try {
    await transporter.sendMail({
      from: 'no-reply@empirepizzapub.com',
      to: ['rohangharate@gmail.com', email, 'info@plutusai.io'],
      subject: `Catering Order: ${fullName}`,
      html: `
        <h2>New Catering Order</h2>
        <ul>
          <li><strong>Name:</strong> ${fullName}</li>
          <li><strong>Phone:</strong> ${phNum}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Order:</strong> ${orderDetails}</li>
          <li><strong>Party Size:</strong> ${partySize}</li>
          <li><strong>Address:</strong> ${address}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Time:</strong> ${time}</li>
        </ul>
      `,
    });
    res.status(200).send('✅ Thank you! Your catering order has been sent.');
  } catch (err) {
    console.error(err);
    res.status(500).send('🚨 Something went wrong, please try again later.');
  }
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
