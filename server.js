try {
  await import('dotenv/config');
} catch (error) {
  if (error?.code !== 'ERR_MODULE_NOT_FOUND') {
    throw error;
  }
}
import express from 'express';
import cors from 'cors';

const { default: connectDB } = await import('./db.js');
const { default: employeesRouter } = await import('./routes/employees.js');
const { default: insightsRouter } = await import('./routes/insights.js');
const { default: metadataRouter } = await import('./routes/metadata.js');

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
