import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

const MONGO_URL = process.env.MONGO_URL ?? ''
const PORT = process.env.PORT ?? 3000;
mongoose.connect(MONGO_URL);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
  res.send('Hello World');
});

app.post('/register', (req, res) => {
  
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});