import express, { Request, Response } from 'express';
const cors = require('cors');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const app = express();
const PORT = process.env.PORT ?? 5000;
const excelRoutes = require('./routes/excelRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const morgan = require('morgan');

dotenv.config();
connectDB();
app.use(morgan('tiny'));
app.use(cors());

app.use(express.json());
app.use('/api', excelRoutes);
app.use('/api/user', userRoutes);
app.use('/api', transactionRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world!');
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
