const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const propertyRequestRoutes = require('./routes/propertyRequestRoutes');
const adRoutes = require('./routes/adRoutes');
// const searchRoutes = require('./routes/searchRoutes');

dotenv.config();

// Connect to MongoDB (replace with your connection string)
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error(err));

const app = express();

app.use(express.json());
app.use(cors()); // (remove for production)

// Routes
app.use('/api/users', userRoutes);
app.use('/api/propertyRequests', propertyRequestRoutes);
app.use('/api/ads', adRoutes);
// app.use('/api/search', searchRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
