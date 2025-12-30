// Initiate App
const express = require('express');
const app = express(); 

// Enable CORS
const cors = require('cors');
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Load environment variables
require("dotenv").config();



// Health Check Endpoint ============= //
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'Backend is running' });
});


// ========================== ROUTES ========================== //
const blogPostsRoutes = require('./routes/blogPostsRoutes');
app.use('/blogPosts', blogPostsRoutes);

const jobPostsRoutes = require('./routes/jobPostsRoutes');
app.use('/jobPosts', jobPostsRoutes);



const port = process.env.PORT || 3000;

// Port Listening
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

module.exports = app;