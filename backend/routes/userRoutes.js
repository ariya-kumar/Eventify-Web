const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyUser } = require('../middleware/authMiddleware');

router.get('/events', userController.getAllEvents);
router.get('/events/:id', userController.getEventById);
router.get('/services', userController.getAllServices);
router.get('/services/:id', userController.getServiceById);

router.post('/bookings', verifyUser, userController.createBooking);
router.get('/bookings', verifyUser, userController.getUserBookings);
router.get('/bookings/:id', verifyUser, userController.getUserBookingById);
router.put('/bookings/:id/cancel', verifyUser, userController.cancelBooking);

module.exports = router;
