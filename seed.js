require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding...');

  await User.deleteMany({});
  await Item.deleteMany({});

  const adminPass = await bcrypt.hash('admin123', 10);
  const userPass = await bcrypt.hash('user123', 10);

  const admin = await User.create({ name: 'Admin', email: 'admin@saiuniversity.edu', password: adminPass, role: 'admin' });
  const user1 = await User.create({ name: 'Alice', email: 'alice@saiuniversity.edu', password: userPass });
  const user2 = await User.create({ name: 'Bob', email: 'bob@saiuniversity.edu', password: userPass });

  const sampleItems = [
    { title: 'Black iPhone 13', category: 'Electronics', description: 'iPhone 13 with cracked screen protector', location: 'Library 2nd Floor', date: new Date('2026-11-01'), type: 'lost', reportedBy: user1._id },
    { title: 'Blue Water Bottle', category: 'Other', description: 'Blue Milton water bottle', location: 'Canteen', date: new Date('2026-11-02'), type: 'found', reportedBy: user2._id },
    { title: 'Student ID Card', category: 'ID Card', description: 'ID card with name starting with R', location: 'Main Gate', date: new Date('2026-11-03'), type: 'found', reportedBy: user1._id },
    { title: 'Data Structures Textbook', category: 'Books', description: 'Cormen CLRS book', location: 'CS Lab 3', date: new Date('2026-11-04'), type: 'lost', reportedBy: user2._id },
    { title: 'Grey Hoodie', category: 'Clothing', description: 'Grey Nike hoodie, size M', location: 'Sports Ground', date: new Date('2026-11-05'), type: 'lost', reportedBy: user1._id },
    { title: 'Car Keys', category: 'Keys', description: 'Keychain with red tag', location: 'Parking Lot A', date: new Date('2026-11-06'), type: 'found', reportedBy: user2._id },
    { title: 'Black Backpack', category: 'Bag', description: 'Wildcraft backpack with laptop', location: 'Auditorium', date: new Date('2026-11-07'), type: 'lost', reportedBy: user1._id },
    { title: 'Airpods Pro', category: 'Electronics', description: 'White airpods case with name sticker', location: 'Library Entrance', date: new Date('2026-11-08'), type: 'found', reportedBy: user2._id },
    { title: 'Lab Coat', category: 'Clothing', description: 'White lab coat, name tag: S', location: 'Physics Lab', date: new Date('2026-11-09'), type: 'found', reportedBy: user1._id },
    { title: 'Calculator', category: 'Electronics', description: 'Casio fx-991', location: 'Exam Hall 2', date: new Date('2026-11-10'), type: 'lost', reportedBy: user2._id }
  ];

  await Item.insertMany(sampleItems);
  console.log('Seeded 10 items + 3 users');
  console.log('Admin: admin@saiuniversity.edu / admin123');
  console.log('User:  alice@saiuniversity.edu / user123');
  await mongoose.disconnect();
};

run().catch((e) => { console.error(e); process.exit(1); });
