// Load environment variables from .env
require('dotenv').config();

console.log('Checking email-related environment variables:');
console.log('EMAIL_HOST:', process.env.EMAIL_HOST ? 'defined' : 'undefined');
console.log('EMAIL_PORT:', process.env.EMAIL_PORT ? 'defined' : 'undefined');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'defined' : 'undefined');
console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? 'defined (value hidden)' : 'undefined');
console.log('EMAIL_FROM:', process.env.EMAIL_FROM ? 'defined' : 'undefined');
console.log('EMAIL_SECURE:', process.env.EMAIL_SECURE ? 'defined' : 'undefined'); 