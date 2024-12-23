const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const commissionRoutes = require('./routes/commission.routes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();

app.use(cors({
  origin: [
    'https://your-frontend-domain.github.io',
    'http://localhost:5173'
  ],
  credentials: true
}));

app.use(express.json());

app.use('/api/commissions', commissionRoutes);

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});