const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @route    POST api/appointments
// @desc     Book an appointment
// @access   Private (Patient)
router.post('/', auth, async (req, res) => {
    const { doctorId, date } = req.body;

    try {
        if (req.user.role !== 'patient') {
            return res.status(401).json({ msg: 'Only patients can book appointments' });
        }

        const newAppointment = new Appointment({
            patient: req.user.id,
            doctor: doctorId,
            date,
        });

        const appointment = await newAppointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    GET api/appointments
// @desc     Get user's appointments
// @access   Private
router.get('/', auth, async (req, res) => {
    try {
        let appointments;
        if (req.user.role === 'patient') {
            appointments = await Appointment.find({ patient: req.user.id }).populate('doctor', 'username specialization');
        } else {
            appointments = await Appointment.find({ doctor: req.user.id }).populate('patient', 'username');
        }
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route    PUT api/appointments/cancel/:id
// @desc     Cancel an appointment
// @access   Private
router.put('/cancel/:id', auth, async (req, res) => {
    try {
        let appointment = await Appointment.findById(req.id || req.params.id);

        if (!appointment) return res.status(404).json({ msg: 'Appointment not found' });

        // Make sure user owns appointment
        if (appointment.patient.toString() !== req.user.id && appointment.doctor.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        appointment.status = 'cancelled';
        await appointment.save();

        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
