const twilio = require('twilio');

// Initialize Twilio client
let twilioClient = null;

if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
}

// Generate random 6-digit verification code
const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send SMS verification code
const sendVerificationSMS = async (phone, code) => {
  if (!twilioClient) {
    console.log('⚠️  Twilio not configured. Verification code:', code);
    // In development, log the code instead of sending SMS
    if (process.env.NODE_ENV === 'development') {
      return { success: true, message: 'Code logged (dev mode)', code };
    }
    throw new Error('SMS service not configured');
  }

  try {
    const message = await twilioClient.messages.create({
      body: `Your Tennis Platform verification code is: ${code}. Valid for 10 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone
    });

    console.log('✅ SMS sent:', message.sid);
    return { success: true, messageSid: message.sid };
  } catch (error) {
    console.error('❌ SMS send error:', error);
    throw new Error('Failed to send verification SMS');
  }
};

// Format phone number to international format
const formatPhoneNumber = (phone) => {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '');
  
  // Add +994 prefix if not present (Azerbaijan)
  if (!cleaned.startsWith('994')) {
    // If starts with 0, remove it
    if (cleaned.startsWith('0')) {
      cleaned = '994' + cleaned.substring(1);
    } else {
      cleaned = '994' + cleaned;
    }
  }
  
  return '+' + cleaned;
};

// Validate phone number format
const validatePhoneNumber = (phone) => {
  // Check if phone is in valid format for Azerbaijan
  const azPhoneRegex = /^(\+994|994|0)?(50|51|55|70|77|99)\d{7}$/;
  return azPhoneRegex.test(phone.replace(/\s/g, ''));
};

module.exports = {
  generateVerificationCode,
  sendVerificationSMS,
  formatPhoneNumber,
  validatePhoneNumber,
};
