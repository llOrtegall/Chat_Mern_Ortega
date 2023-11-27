import express from 'express';

const app = express();
const PORT = 4040;

app.get('/test', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});