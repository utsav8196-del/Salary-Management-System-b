import express from 'express';
import { Employee } from '../db.js';

const router = express.Router();

router.get('/countries', async (req, res) => {
  try {
    const countries = await Employee.distinct('country');
    res.json(countries.sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/job-titles', async (req, res) => {
  try {
    const jobTitles = await Employee.distinct('job_title');
    res.json(jobTitles.sort());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
