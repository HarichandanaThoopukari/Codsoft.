const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Job = require('../models/Job');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
};

const sampleEmployers = [
  { name: 'Tech Corp HR', email: 'hr@techcorp.com', password: 'password123', role: 'employer', companyName: 'TechCorp Solutions', industry: 'Technology', companySize: '500-1000', companyDescription: 'Leading software solutions provider' },
  { name: 'HealthPlus Recruiter', email: 'jobs@healthplus.com', password: 'password123', role: 'employer', companyName: 'HealthPlus Inc', industry: 'Healthcare', companySize: '100-500', companyDescription: 'Innovative healthcare company' },
];

const sampleJobs = (employerId) => [
  {
    title: 'Senior React Developer',
    company: 'TechCorp Solutions',
    description: 'We are looking for an experienced React developer to join our growing team. You will be responsible for building and maintaining web applications.',
    responsibilities: ['Build responsive UI components', 'Collaborate with backend team', 'Code reviews and mentoring'],
    requirements: ['5+ years React experience', 'Strong TypeScript skills', 'REST API experience'],
    skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'CSS'],
    location: 'San Francisco, CA',
    jobType: 'Full-time',
    experienceLevel: 'Senior',
    salaryMin: 120000,
    salaryMax: 160000,
    category: 'Technology',
    employer: employerId,
    isFeatured: true,
    benefits: ['Health insurance', 'Remote work', '401k', 'Stock options']
  },
  {
    title: 'Product Manager',
    company: 'TechCorp Solutions',
    description: 'Lead product development initiatives and work closely with engineering, design, and business teams.',
    requirements: ['3+ years PM experience', 'Agile methodology', 'Data-driven mindset'],
    skills: ['Product Strategy', 'Agile', 'JIRA', 'Analytics'],
    location: 'Remote',
    jobType: 'Remote',
    experienceLevel: 'Mid Level',
    salaryMin: 90000,
    salaryMax: 130000,
    category: 'Product',
    employer: employerId,
    isFeatured: true,
  },
];

const seed = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    await Job.deleteMany({});
    console.log('Cleared existing data');

    const employers = await User.create(sampleEmployers);
    console.log(`Created ${employers.length} employers`);

    const allJobs = sampleJobs(employers[0]._id);
    await Job.create(allJobs);
    console.log(`Created ${allJobs.length} sample jobs`);

    // Create sample candidate
    await User.create({
      name: 'John Candidate',
      email: 'john@example.com',
      password: 'password123',
      role: 'candidate',
      skills: ['React', 'JavaScript', 'CSS'],
      bio: 'Experienced frontend developer'
    });
    console.log('Created sample candidate');
    console.log('\n✅ Seeding complete!');
    console.log('Employer login: hr@techcorp.com / password123');
    console.log('Candidate login: john@example.com / password123');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seed();
