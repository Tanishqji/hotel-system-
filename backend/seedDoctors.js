const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

const doctors = [
    { username: 'Dr. Smith', password: 'password123', role: 'doctor', specialization: 'Cardiologist' },
    { username: 'Dr. Johnson', password: 'password123', role: 'doctor', specialization: 'Neurologist' },
    { username: 'Dr. Williams', password: 'password123', role: 'doctor', specialization: 'Orthopedic' },
    { username: 'Dr. Brown', password: 'password123', role: 'doctor', specialization: 'Pediatrician' }
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB for seeding...');

        for (const doc of doctors) {
            const existing = await User.findOne({ username: doc.username });
            if (!existing) {
                const salt = await bcrypt.genSalt(10);
                doc.password = await bcrypt.hash(doc.password, salt);
                const newDoc = new User(doc);
                await newDoc.save();
                console.log(`Added: ${doc.username}`);
            } else {
                console.log(`Skipped: ${doc.username} (Already exists)`);
            }
        }

        console.log('Seeding completed!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDoctors();
