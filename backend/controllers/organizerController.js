const Event = require('../models/Event');
const Service = require('../models/Service');
const bookingService = require('../services/bookingService');

exports.createService = async (req, res) => {
  try {
    const { 
      organizerName, 
      serviceType, 
      location, 
      rating, 
      description, 
      packages 
    } = req.body;

    console.log('Creating service for organizer:', req.organizer._id);

    if (!organizerName || !serviceType || !location || !description || !packages) {
      return res.status(400).json({ 
        message: 'All fields are required: organizerName, serviceType, location, description, packages' 
      });
    }

    const service = new Service({
      organizerName,
      serviceType,
      location,
      rating: rating || 0,
      description,
      packages,
      organizer: req.organizer._id
    });

    await service.save();
    
    res.status(201).json({ 
      message: 'Service created successfully', 
      service: {
        _id: service._id,
        organizerName: service.organizerName,
        serviceType: service.serviceType,
        location: service.location,
        rating: service.rating,
        description: service.description,
        packages: service.packages,
        organizer: service.organizer
      }
    });
  } catch (err) {
    console.error('Error creating service:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error while creating service' });
  }
};

exports.getOrganizerServices = async (req, res) => {
  try {
    const services = await Service.find({ organizer: req.organizer._id })
      .sort({ createdAt: -1 })
      .select('-__v');

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
        createdAt: service.createdAt,
        updatedAt: service.updatedAt
      }))
    });
  } catch (err) {
    console.error('Error fetching services:', err);
    res.status(500).json({ message: 'Server error while fetching services' });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findOne({ 
      _id: req.params.id, 
      organizer: req.organizer._id 
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ service });
  } catch (err) {
    console.error('Error fetching service:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { organizerName, serviceType, location, rating, description, packages } = req.body;

    const service = await Service.findOneAndUpdate(
      { _id: req.params.id, organizer: req.organizer._id },
      { organizerName, serviceType, location, rating, description, packages },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json({ message: 'Service updated successfully', service });
  } catch (err) {
    console.error('Error updating service:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findOne({ 
      _id: req.params.id, 
      organizer: req.organizer._id 
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: 'Service deleted successfully' });
  } catch (err) {
    console.error('Error deleting service:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { name, date, venue, description, packages } = req.body;

    console.log('Creating event for organizer:', req.organizer._id);

    if (!name || !date || !venue || !description || !packages) {
      return res.status(400).json({ 
        message: 'All fields are required: name, date, venue, description, packages' 
      });
    }

    const event = new Event({
      name,
      date,
      venue,
      description,
      packages,
      organizer: req.organizer._id
    });

    await event.save();
    
    res.status(201).json({ 
      message: 'Event created successfully', 
      event: {
        _id: event._id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        description: event.description,
        packages: event.packages,
        organizer: event.organizer
      }
    });
  } catch (err) {
    console.error('Error creating event:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error while creating event' });
  }
};

exports.getOrganizerEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.organizer._id })
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({ 
      message: 'Events fetched successfully',
      events: events.map(event => ({
        _id: event._id,
        name: event.name,
        date: event.date,
        venue: event.venue,
        description: event.description,
        packages: event.packages,
        createdAt: event.createdAt,
        updatedAt: event.updatedAt
      }))
    });
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      organizer: req.organizer._id 
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ event });
  } catch (err) {
    console.error('Error fetching event:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const { name, date, venue, description, packages } = req.body;

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, organizer: req.organizer._id },
      { name, date, venue, description, packages },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event updated successfully', event });
  } catch (err) {
    console.error('Error updating event:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(error => error.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      _id: req.params.id, 
      organizer: req.organizer._id 
    });

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error('Error deleting event:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrganizerBookings = async (req, res) => {
  try {
    console.log('Fetching bookings for organizer:', req.organizer._id);
    const bookings = await bookingService.getOrganizerBookings(req.organizer._id);

    res.json({ 
      message: 'Bookings fetched successfully',
      bookings: bookings.map(booking => ({
        _id: booking._id,
        type: booking.type,
        user: booking.user,
        event: booking.event,
        service: booking.service,
        package: booking.package,
        quantity: booking.quantity,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        bookingDate: booking.bookingDate,
        customerNotes: booking.customerNotes,
        createdAt: booking.createdAt
      }))
    });
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await bookingService.updateBookingStatus(req.params.id, req.organizer._id, status);

    res.json({ message: `Booking ${status} successfully`, booking });
  } catch (err) {
    console.error('Error updating booking status:', err);
    if (err.statusCode) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
};
