import 'dotenv/config';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import connectDB, { Employee } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const JOB_TITLES = [
  // Engineering
  'Software Engineer', 'Senior Software Engineer', 'Junior Software Engineer',
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Mobile Developer', 'iOS Developer', 'Android Developer',
  'DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer',
  'Data Engineer', 'Machine Learning Engineer', 'AI Engineer',
  'QA Engineer', 'Security Engineer', 'Embedded Systems Engineer',
  'Blockchain Developer', 'Game Developer',
  // Management
  'Engineering Manager', 'Product Manager', 'Project Manager',
  'Program Manager', 'Scrum Master', 'Delivery Manager',
  'Operations Manager', 'General Manager', 'Chief Technology Officer',
  'Chief Executive Officer', 'Chief Financial Officer', 'Chief Operating Officer',
  // Data & Analytics
  'Data Analyst', 'Data Scientist', 'Business Analyst',
  'Business Intelligence Analyst', 'Database Administrator', 'Data Architect',
  // Design
  'UX Designer', 'UI Designer', 'Product Designer',
  'Graphic Designer', 'Motion Designer', 'UX Researcher',
  // Sales & Marketing
  'Sales Director', 'Sales Manager', 'Sales Executive',
  'Account Manager', 'Business Development Manager', 'Marketing Manager',
  'Marketing Specialist', 'Digital Marketing Analyst', 'SEO Specialist',
  'Content Writer', 'Brand Manager', 'Growth Hacker',
  // HR & Finance
  'HR Manager', 'HR Business Partner', 'Talent Acquisition Specialist',
  'Recruiter', 'Payroll Specialist', 'Financial Analyst',
  'Finance Manager', 'Accountant', 'Auditor', 'Tax Consultant',
  // Support & Operations
  'Customer Support Lead', 'Customer Success Manager', 'Technical Support Engineer',
  'IT Support Specialist', 'Network Administrator', 'Systems Administrator',
  'Technical Writer', 'Documentation Specialist', 'Training Specialist'
];

const COUNTRIES = [
  'India', 'USA', 'Canada', 'UK', 'Germany', 'France', 'Japan',
  'Australia', 'Brazil', 'Mexico', 'Spain', 'Italy', 'Netherlands', 'Singapore',
  'China', 'South Korea', 'UAE', 'Saudi Arabia', 'South Africa', 'Nigeria',
  'Kenya', 'Egypt', 'Turkey', 'Russia', 'Poland', 'Sweden', 'Norway',
  'Denmark', 'Finland', 'Switzerland', 'Austria', 'Belgium', 'Portugal',
  'Argentina', 'Chile', 'Colombia', 'Peru', 'Indonesia', 'Malaysia',
  'Thailand', 'Vietnam', 'Philippines', 'Bangladesh', 'Pakistan', 'Sri Lanka',
  'New Zealand', 'Ireland', 'Israel', 'Greece', 'Czech Republic'
];

const firstNames = readFileSync(join(__dirname, 'first_names.txt'), 'utf-8')
  .split('\n').filter(n => n.trim().length > 0);

const lastNames = readFileSync(join(__dirname, 'last_names.txt'), 'utf-8')
  .split('\n').filter(n => n.trim().length > 0);

function getRandomItem(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    .toISOString().split('T')[0];
}

function generateSalary(jobTitle) {
  if (jobTitle.includes('Chief') || jobTitle.includes('Director'))
    return Math.floor(Math.random() * (500000 - 200000) + 200000);
  if (jobTitle.includes('Senior') || jobTitle.includes('Manager') || jobTitle.includes('Lead'))
    return Math.floor(Math.random() * (200000 - 80000) + 80000);
  if (jobTitle.includes('Junior'))
    return Math.floor(Math.random() * (60000 - 25000) + 25000);
  return Math.floor(Math.random() * (120000 - 40000) + 40000);
}

await connectDB();

console.log('Clearing existing data...');
await Employee.deleteMany({});

const employees = [];
const usedEmails = new Set();
const startDate = new Date('2018-01-01');
const endDate = new Date('2024-12-31');

for (let i = 0; i < 10000; i++) {
  const firstName = getRandomItem(firstNames);
  const lastName = getRandomItem(lastNames);
  const jobTitle = getRandomItem(JOB_TITLES);
  const country = getRandomItem(COUNTRIES);
  const salary = generateSalary(jobTitle);
  const hire_date = getRandomDate(startDate, endDate);

  let emailBase = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`.replace(/[^a-z0-9.]/g, '');
  let email = `${emailBase}@company.com`;
  let counter = 1;
  while (usedEmails.has(email)) { email = `${emailBase}${counter++}@company.com`; }
  usedEmails.add(email);

  employees.push({ full_name: `${firstName} ${lastName}`, job_title: jobTitle, country, salary, email, hire_date });
}

console.log('Seeding 10,000 employees...');
const startTime = Date.now();
await Employee.insertMany(employees, { ordered: false });
console.log(`✅ Seeded 10,000 employees in ${Date.now() - startTime}ms`);

const count = await Employee.countDocuments();
console.log(`Total employees in MongoDB: ${count}`);
process.exit(0);
