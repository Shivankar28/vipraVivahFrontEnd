// Environment-based API URL configuration
const getBaseURL = () => {
  // Check if we're in development mode
  // if (import.meta.env.DEV) {
  //   // For local development, you can use either:
  //   // 1. localhost for same device testing
  //   // 2. Your local IP for network device testing
  //   // Replace '192.168.1.100' with your actual local IP address
  //   return 'http://192.168.1.5:3000'; // Change to your IP like 'http://192.168.1.100:3000'
  // }
  // Production URL
  // return 'https://api.vipravivah.in';
  return 'https://api.vipravivah.in';
};

const BASE_URL = getBaseURL();

export { BASE_URL };
