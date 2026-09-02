const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');
const { verifyOrganizer } = require('../middleware/authMiddleware');

router.post('/services', verifyOrganizer, organizerController.createService);
router.get('/services', verifyOrganizer, organizerController.getOrganizerServices);
router.get('/services/:id', verifyOrganizer, organizerController.getServiceById);
router.put('/services/:id', verifyOrganizer, organizerController.updateService);
router.delete('/services/:id', verifyOrganizer, organizerController.deleteService);

router.post('/events', verifyOrganizer, organizerController.createEvent);
router.get('/events', verifyOrganizer, organizerController.getOrganizerEvents);
router.get('/events/:id', verifyOrganizer, organizerController.getEventById);
router.put('/events/:id', verifyOrganizer, organizerController.updateEvent);
router.delete('/events/:id', verifyOrganizer, organizerController.deleteEvent);

router.get('/bookings', verifyOrganizer, organizerController.getOrganizerBookings);
router.put('/bookings/:id/status', verifyOrganizer, organizerController.updateBookingStatus);

module.exports = router;
