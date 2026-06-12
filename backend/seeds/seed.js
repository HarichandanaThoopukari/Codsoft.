import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Quiz from '../models/Quiz.js';
import bcrypt from 'bcryptjs';
import { sampleQuizzes } from '../data/sampleQuizzes.js';

dotenv.config();

const importData = async () => {
  try {
    await connectDB();
    await Quiz.deleteMany();
    await User.deleteMany();

    const password = await bcrypt.hash('Password123', 10);

    const admin = await User.create({
      name: 'HARICHANDANA THOOPUKARI',
      email: 'admin@example.com',
      password,
      role: 'admin',
    });
    const creator = await User.create({
      name: 'Quiz Creator',
      email: 'creator@example.com',
      password,
      role: 'creator',
    });
    await User.create({
      name: 'Quiz Taker',
      email: 'user@example.com',
      password,
      role: 'user',
    });

    const quizzes = sampleQuizzes.map((quiz) => ({ ...quiz, creator: creator._id }));
    await Quiz.insertMany(quizzes);

    console.log('✅ Seed data imported successfully!');
    console.log('─────────────────────────────────────────');
    console.log('Admin:   admin@example.com   / Password123');
    console.log('Creator: creator@example.com / Password123');
    console.log('User:    user@example.com    / Password123');
    console.log('─────────────────────────────────────────');
    process.exit();
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

importData();
