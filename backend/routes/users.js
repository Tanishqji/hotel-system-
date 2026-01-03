const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route    GET api/users/patients
// @desc     Get all patients
// @access   Private (only for doctors)
router.get('/patients', auth, async (req, res) => {
    try {
        if (req.user.role !== 'doctor') {
            return res.status(401).json({ msg: 'Not authorized' });
        }
        const patients = await User.find({ role: 'patient' }).select('-password');
        res.json(patients);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/users/doctors
// @desc     Get all doctors
// @access   Public
router.get('/doctors', async (req, res) => {
    try {
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.json(doctors);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
