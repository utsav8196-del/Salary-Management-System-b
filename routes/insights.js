import express from 'express';
import { Employee } from '../db.js';

const router = express.Router();

// Get min, max, avg salary for a country
router.get('/country/:country', async (req, res) => {
  try {
    const { country } = req.params;
    const result = await Employee.aggregate([
      { $match: { country } },
      { $group: {
        _id: null,
        minSalary: { $min: '$salary' },
        maxSalary: { $max: '$salary' },
        avgSalary: { $avg: '$salary' },
        employeeCount: { $sum: 1 }
      }}
    ]);
    const data = result[0] || { minSalary: 0, maxSalary: 0, avgSalary: 0, employeeCount: 0 };
    res.json({ country, minSalary: data.minSalary, maxSalary: data.maxSalary, avgSalary: Math.round(data.avgSalary), employeeCount: data.employeeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get average salary for a job title in a country
router.get('/country/:country/job-title/:jobTitle', async (req, res) => {
  try {
    const { country, jobTitle } = req.params;
    const result = await Employee.aggregate([
      { $match: { country, job_title: jobTitle } },
      { $group: { _id: null, avgSalary: { $avg: '$salary' }, employeeCount: { $sum: 1 } } }
    ]);
    const data = result[0] || { avgSalary: 0, employeeCount: 0 };
    res.json({ country, jobTitle, avgSalary: Math.round(data.avgSalary), employeeCount: data.employeeCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get salary stats grouped by country
router.get('/country-stats', async (req, res) => {
  try {
    const stats = await Employee.aggregate([
      { $group: {
        _id: '$country',
        employeeCount: { $sum: 1 },
        minSalary: { $min: '$salary' },
        maxSalary: { $max: '$salary' },
        avgSalary: { $avg: '$salary' }
      }},
      { $project: { country: '$_id', employeeCount: 1, minSalary: 1, maxSalary: 1, avgSalary: { $round: ['$avgSalary', 0] }, _id: 0 } },
      { $sort: { employeeCount: -1 } }
    ]);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get global salary metrics
router.get('/global', async (req, res) => {
  try {
    const result = await Employee.aggregate([
      { $group: {
        _id: null,
        globalMin: { $min: '$salary' },
        globalMax: { $max: '$salary' },
        globalAvg: { $avg: '$salary' },
        totalEmployees: { $sum: 1 }
      }}
    ]);
    const data = result[0] || { globalMin: 0, globalMax: 0, globalAvg: 0, totalEmployees: 0 };
    res.json({ globalMin: data.globalMin, globalMax: data.globalMax, globalAvg: Math.round(data.globalAvg), totalEmployees: data.totalEmployees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
