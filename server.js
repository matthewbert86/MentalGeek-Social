// Set up express server
const express = require('express');
// Bring in our Database
const connectDB = require('./config/db');
// bring in validator
const { check, validationResult } = require('express-validator');

// Initialize app variable with express
const app = express();

// Connect Database
connectDB();

// Init Middleware
// This will allow us to get the data in req.body
app.use(express.json({ extended: false }));

// res.send will send data to the browser
app.get('/', (req, res) => res.send('API Running'));

// Define Routes so we can access them
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Set up PORT
const PORT = process.env.PORT || 5000;

// Listen on a port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
