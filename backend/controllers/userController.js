const Event = require('../models/Event');
const Service = require('../models/Service');
const Booking = require('../models/Booking');
const bookingService = require('../services/bookingService');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'businessName email phone')
      .sort({ createdAt: -1 });

    res.json({ 
      message: 'Events fetched successfully',
      events: events.map(event => ({
        _id: event._id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        description: event.description,
        packages: event.packages,
        organizer: event.organizer,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }))
    });
  } catch (err) {
    console.error('Error fetching events for users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'businessName email phone serviceType');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('organizer', 'businessName email phone')
      .sort({ createdAt: -1 });

    res.json({ 
      message: 'Services fetched successfully',
      services: services.map(service => ({
        _id: service._id,
        organizerName: service.organizerName,
        serviceType: service.serviceType,
        location: service.location,
        rating: service.rating,
        description: service.description,
        packages: service.packages,
        organizer: service.organizer,
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }))
    });
  } catch (err) {
    console.error('Error fetching services for users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ 
      _id: req.params.id, 
      isActive: true 
    }).populate('organizer', 'businessName email phone serviceType');

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ service });
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { 
      eventId, 
      serviceId, 
      ticketType, 
      quantity, 
      packageName,
      customerNotes 
    } = req.body;
    
    const io = req.app.get('io');

    const booking = await bookingService.createBooking({
      userId: req.user._id,
      eventId,
      serviceId,
      ticketType,
      quantity,
      packageName,
      customerNotes,
      io
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: {
        _id: booking._id,
        type: booking.type,
        event: booking.event,
        service: booking.service,
        package: booking.package,
        quantity: booking.quantity,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        bookingDate: booking.bookingDate,
        createdAt: booking.createdAt
      }
    });

  } catch (err) {
    console.error('Error creating booking:', err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error while creating booking' });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'name date venue')
      .populate('service', 'organizerName serviceType location')
      .sort({ createdAt: -1 });

    res.json({
      message: 'Bookings fetched successfully',
      bookings: bookings.map(booking => ({
        _id: booking._id,
        type: booking.type,
        event: booking.event,
        service: booking.service,
        package: booking.package,
        quantity: booking.quantity,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        bookingDate: booking.bookingDate,
        createdAt: booking.createdAt
      }))
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    })
    .populate('event', 'name date venue organizer')
    .populate('service', 'organizerName serviceType location organizer')
    .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ booking });
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ 
      _id: req.params.id, 
      user: req.user._id 
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
