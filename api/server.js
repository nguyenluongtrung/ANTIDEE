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
app.use('/antidee/api/questions', require('./routes/questionRoutes'));
app.use('/antidee/api/exams', require('./routes/examRoutes'));
app.use('/antidee/api/qualifications', require('./routes/qualificationRoutes'));
app.use('/antidee/api/services', require('./routes/serviceRoutes'));
app.use('/antidee/api/vouchers', require('./routes/voucherRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
