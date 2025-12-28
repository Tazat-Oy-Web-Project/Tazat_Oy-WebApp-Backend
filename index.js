// Initiate App
const express = require('express');
const app = express(); 

// Enable CORS
const cors = require('cors');
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());



// ========================== ROUTES ========================== //

// Sample Route
app.get('/', (req, res) => {
  res.send('Hello World!');
});




// Port Listening
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});