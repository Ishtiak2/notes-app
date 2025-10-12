const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.FRONTEND_PORT || 8000;

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, 'frontend')));

// Handle SPA routing - send index.html for all routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Frontend server running on http://localhost:${PORT}`);
});