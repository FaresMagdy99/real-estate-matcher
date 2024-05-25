const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const propertyRequestRoutes = require('./routes/propertyRequestRoutes');
const adRoutes = require('./routes/adRoutes');
const statsRoutes = require('./routes/statsRoutes');
const searchRoutes = require('./routes/searchRoutes');

const cronJobs = require('./utils/cronJobs');

const swaggerUi = require('swagger-ui-express');
const specs = require('./utils/swagger');

dotenv.config();


const app = express();

app.use(express.json());
app.use(cors()); // remove for production

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/users', userRoutes);
app.use('/api/propertyRequests', propertyRequestRoutes);
app.use('/api/ads', adRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/search', searchRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  let message;
  if(err.status === 400){
    message = err.message;
  }else{
    message = 'Server Error';
  }
  res.status(500).json({ message });
});


const port = process.env.PORT || 5000;
// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => app.listen(port, () => console.log(`Server listening on port ${port}`)))
  .catch(err => console.error(err));

module.exports = app;
