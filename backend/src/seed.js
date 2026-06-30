require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Opportunity = require('./models/Opportunity');

const seed = async () => {
  await connectDB();

  await User.deleteMany();
  await Opportunity.deleteMany();
  console.log('Cleared existing data');

  // Use User.create so pre-save bcrypt hook runs correctly
  const rahul = await User.create({ name: 'Rahul Sharma', email: 'rahul@demo.com', password: 'Password123' });
  const priya = await User.create({ name: 'Priya Mehta', email: 'priya@demo.com', password: 'Password123' });
  console.log('Users created');

  await Opportunity.insertMany([
    {
      owner: rahul._id,
      customerName: 'Tata Consultancy Services',
      contactName: 'Amit Verma',
      contactEmail: 'amit@tcs.com',
      contactPhone: '+91 98765 43210',
      requirement: 'Enterprise ERP integration for 5000+ employee onboarding workflow',
      estimatedValue: 2500000,
      stage: 'Proposal Sent',
      priority: 'High',
      nextFollowUpDate: new Date('2025-07-15'),
      notes: 'Decision expected by end of July. Key stakeholder is CTO.',
    },
    {
      owner: rahul._id,
      customerName: 'Infosys BPM',
      contactName: 'Sneha Rao',
      contactEmail: 'sneha@infosys.com',
      requirement: 'Custom CRM dashboard for sales team of 200 agents',
      estimatedValue: 850000,
      stage: 'Qualified',
      priority: 'Medium',
      nextFollowUpDate: new Date('2025-07-10'),
      notes: 'Demo scheduled next week.',
    },
    {
      owner: rahul._id,
      customerName: 'Zomato Ltd',
      contactName: 'Vikram Nair',
      contactEmail: 'vikram@zomato.com',
      requirement: 'Real-time analytics platform for restaurant partners',
      estimatedValue: 1200000,
      stage: 'Won',
      priority: 'High',
      notes: 'Contract signed. Kickoff on Aug 1.',
    },
    {
      owner: priya._id,
      customerName: 'Flipkart Internet',
      contactName: 'Divya Kulkarni',
      contactEmail: 'divya@flipkart.com',
      requirement: 'Vendor onboarding portal with document verification',
      estimatedValue: 3200000,
      stage: 'Contacted',
      priority: 'High',
      nextFollowUpDate: new Date('2025-07-08'),
      notes: 'Initial call done. Waiting for internal approval.',
    },
    {
      owner: priya._id,
      customerName: 'OYO Rooms',
      contactName: 'Karan Joshi',
      contactEmail: 'karan@oyo.com',
      requirement: 'Hotel inventory management system with PMS integration',
      estimatedValue: 680000,
      stage: 'New',
      priority: 'Low',
      nextFollowUpDate: new Date('2025-07-20'),
    },
    {
      owner: priya._id,
      customerName: "BYJU'S",
      contactName: 'Meera Pillai',
      contactEmail: 'meera@byjus.com',
      requirement: 'Student progress tracking and parent reporting dashboard',
      estimatedValue: 450000,
      stage: 'Lost',
      priority: 'Medium',
      notes: 'Went with a competitor. Budget constraints cited.',
    },
  ]);

  console.log('Opportunities created');
  console.log('\n--- TEST CREDENTIALS ---');
  console.log('Email: rahul@demo.com  | Password: Password123');
  console.log('Email: priya@demo.com  | Password: Password123');
  console.log('------------------------\n');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});