// Configuration for different environments
const config = {
    // Automatically detect API URL based on environment
    API_URL: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:3000'
        : 'https://your-backend-app.onrender.com' // Replace with your actual Render backend URL after deployment
};

export default config;