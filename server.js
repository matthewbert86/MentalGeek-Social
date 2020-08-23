// Set up express server
const express = require('express');
// Bring in our Database
const connectDB = require('./config/db');

// Initialize app variable with express
const app = express();

// Connect Database
connectDB();

// res.send will send data to the browser
app.get('/', (req, res) => res.send('API Running'));

// Define Routes so we can access them
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/auth', require('./routes/api/auth'));

// Set up PORT
const PORT = process.env.PORT || 5000;

// Listen on a port
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
