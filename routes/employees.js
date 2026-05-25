import express from 'express';
import { Employee } from '../db.js';

const router = express.Router();

// Get employees with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const filter = search ? {
      $or: [
        { full_name: { $regex: search, $options: 'i' } },
        { job_title: { $regex: search, $options: 'i' } },
        { country:   { $regex: search, $options: 'i' } },
        { email:     { $regex: search, $options: 'i' } }
      ]
    } : {};

    const [employees, total] = await Promise.all([
      Employee.find(filter).skip(skip).limit(limit).lean(),
      Employee.countDocuments(filter)
    ]);

    res.json({ employees, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single employee
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).lean();
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create employee
router.post('/', async (req, res) => {
  try {
    const { full_name, job_title, country, salary, email, hire_date } = req.body;
    if (!full_name || !job_title || !country || !salary || !email || !hire_date)
      return res.status(400).json({ error: 'All fields are required' });
    if (salary <= 0)
      return res.status(400).json({ error: 'Salary must be greater than 0' });

    const employee = await Employee.create({ full_name, job_title, country, salary, email, hire_date });
    res.status(201).json(employee);
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: error.message });
  }
});

// Update employee
router.put('/:id', async (req, res) => {
  try {
    const { full_name, job_title, country, salary, email, hire_date } = req.body;
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { full_name, job_title, country, salary, email, hire_date },
      { new: true, runValidators: true }
    ).lean();
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: error.message });
  }
});

// Delete employee
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
