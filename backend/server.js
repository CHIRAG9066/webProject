const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // ✅ Required to resolve frontend path

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('frontend'));


mongoose.connect('mongodb://localhost:27017/MyProjectDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.static(path.join(__dirname, '../frontend')));

// ✅ Default route to serve login.html (or index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// ✅ API routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// ✅ Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
