import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Validate Twilio credentials
const validateTwilioCredentials = () => {
  const requiredEnvVars = [
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'TWILIO_PHONE_NUMBER'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required Twilio environment variables: ${missingVars.join(', ')}`);
  }
};

// Initialize Twilio client
let twilioClient;
try {
  validateTwilioCredentials();
  twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
} catch (error) {
  console.error('Twilio initialization error:', error.message);
  twilioClient = null;
}

const sendSMS = async (to, message) => {
  try {
    if (!twilioClient) {
      throw new Error('Twilio client not initialized. Please check your environment variables.');
    }

    const result = await twilioClient.messages.create({
      body: message,
      to: to,
      from: process.env.TWILIO_PHONE_NUMBER
    });
    
    console.log('SMS sent successfully:', result.sid);
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

export default sendSMS; 