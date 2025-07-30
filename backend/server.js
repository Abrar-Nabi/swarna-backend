const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Twilio WhatsApp credentials
const accountSid = 'ACd372c98fba42bfac4ea711301e6b5a98';
const authToken = '12cab6cc605605fcae259b91dd8c6947';
const whatsappFrom = 'whatsapp:+14155238886'; // Your Twilio sandbox number
const whatsappTo = 'whatsapp:+916239323805';  // Your WhatsApp number

const client = twilio(accountSid, authToken);

app.post("/api/book", async (req, res) => {
  const { name, phone, email, guests, days, title } = req.body;

  const message = `📦 *New Booking Received*\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n📧 Email: ${email}\n👥 Guests: ${guests}\n🗓️ Days: ${days}\n🏖️ Package: ${title}`;

  try {
    // Send message to WhatsApp
    await client.messages.create({
      from: whatsappFrom,
      to: whatsappTo,
      body: message,
    });

    res.status(200).json({ success: true, message: "Booking sent successfully via WhatsApp" });
  } catch (err) {
    console.error("❌ Error sending booking via WhatsApp:", err.message);
    
    // Fallback: just log the message to console
    console.log("📨 Pretend sending WhatsApp message with data:\n", message);

    res.status(500).json({ success: false, message: "Failed to send booking via WhatsApp, fallback logged" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
