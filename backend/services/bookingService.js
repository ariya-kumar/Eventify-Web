const Booking = require('../models/Booking');
const Event = require('../models/Event');
const Service = require('../models/Service');

const createBooking = async ({ userId, eventId, serviceId, ticketType, quantity, packageName, customerNotes, io }) => {
  let bookingData = {
    user: userId,
    type: eventId ? 'event' : 'service',
    quantity: quantity || 1,
    customerNotes,
    status: 'pending',
    paymentStatus: 'pending'
  };

  let totalAmount = 0;

  if (eventId) {
    const event = await Event.findById(eventId);
    if (!event) {
      const error = new Error('Event not found');
      error.statusCode = 404;
      throw error;
    }

    const ticketPackage = event.packages.find(p => p.type === ticketType);
    if (!ticketPackage) {
      const error = new Error('Invalid ticket type');
      error.statusCode = 400;
      throw error;
    }

    bookingData.event = eventId;
    bookingData.ticketType = ticketType;
    bookingData.package = {
      name: ticketPackage.name,
      price: ticketPackage.price
    };
    totalAmount = ticketPackage.price * (quantity || 1);
  } else if (serviceId) {
    const service = await Service.findById(serviceId);
    if (!service) {
      const error = new Error('Service not found');
      error.statusCode = 404;
      throw error;
    }

    const servicePackage = service.packages.find(p => p.name === packageName);
    if (!servicePackage) {
      const error = new Error('Invalid service package');
      error.statusCode = 400;
      throw error;
    }

    bookingData.service = serviceId;
    bookingData.package = {
      name: servicePackage.name,
      price: servicePackage.price
    };
    totalAmount = servicePackage.price;
  } else {
    const error = new Error('Either eventId or serviceId is required');
    error.statusCode = 400;
    throw error;
  }

  bookingData.totalAmount = totalAmount;

  const booking = new Booking(bookingData);
  await booking.save();

  if (eventId) {
    const eventRecord = await Event.findById(eventId);
    if (eventRecord) {
      eventRecord.availableTickets = Math.max(0, (eventRecord.availableTickets || eventRecord.capacity || 0) - (quantity || 1));
      await eventRecord.save();
      if (io) {
        io.emit('bookingUpdate', { eventId, availableTickets: eventRecord.availableTickets });
      }
    }
  }

  await booking.populate('event service', 'name organizerName');
  return booking;
};

const getOrganizerBookings = async (organizerId) => {
  const organizerEvents = await Event.find({ organizer: organizerId });
  const eventIds = organizerEvents.map(event => event._id);
  
  const organizerServices = await Service.find({ organizer: organizerId });
  const serviceIds = organizerServices.map(service => service._id);
  
  const bookings = await Booking.find({
    $or: [
      { event: { $in: eventIds } },
      { service: { $in: serviceIds } }
    ]
  })
  .populate('user', 'name email phone')
  .populate('event', 'name date venue')
  .populate('service', 'organizerName serviceType location')
  .sort({ createdAt: -1 });

  return bookings;
};

const updateBookingStatus = async (bookingId, organizerId, status) => {
  if (!['confirmed', 'cancelled', 'completed'].includes(status)) {
    const error = new Error('Invalid status');
    error.statusCode = 400;
    throw error;
  }

  const booking = await Booking.findById(bookingId)
    .populate('event')
    .populate('service');

  if (!booking) {
    const error = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }

  let isOwner = false;
  if (booking.event) {
    isOwner = booking.event.organizer.toString() === organizerId.toString();
  } else if (booking.service) {
    isOwner = booking.service.organizer.toString() === organizerId.toString();
  }

  if (!isOwner) {
    const error = new Error('Not authorized to update this booking');
    error.statusCode = 403;
    throw error;
  }

  booking.status = status;
  await booking.save();
  return booking;
};

module.exports = {
  createBooking,
  getOrganizerBookings,
  updateBookingStatus
};
