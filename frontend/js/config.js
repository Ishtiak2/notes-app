// Configuration for different environments
const config = {
    // Automatically detect API URL based on environment
    API_URL: window.location.hostname === 'localhost' 
        ? 'http://localhost:3000'
        : 'https://your-backend-url.railway.app' // Replace with your actual backend URL after deployment
};

export default config;