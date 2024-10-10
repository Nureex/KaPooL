require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./src/config/db');

const collectionRoutes = require('./src/routes/routes');



app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Use Routes
app.use('/api', collectionRoutes);

app.get('/', async (req, res) => {
  res.json({ message: 'Welcome to KaPool Backend Api'});
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
