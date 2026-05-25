import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './db.js';
import employeesRouter from './routes/employees.js';
import insightsRouter from './routes/insights.js';
import metadataRouter from './routes/metadata.js';

await connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/employees', employeesRouter);
app.use('/api/insights', insightsRouter);
app.use('/api', metadataRouter);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
