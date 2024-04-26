const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');

const connectDB = require('./config/dbConnect');
const port = process.env.PORT || 5000;

connectDB();

const app = express();
app.use(cors());

app.use(express.json());

app.use('/antidee/api/accounts', require('./routes/accountRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
