import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import axios from '../../src/utils/axios';

const OrganizerDashboardPage = () => {
  const { currentUser } = useAuth();

  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [generalPrice, setGeneralPrice] = useState(0);
  const [vipPrice, setVipPrice] = useState(0);

  const [serviceOrganizerName, setServiceOrganizerName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [serviceLocation, setServiceLocation] = useState('');
  const [serviceRating, setServiceRating] = useState(0);
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePackages, setServicePackages] = useState([
    {
      name: 'Basic Package',
      price: 0,
      description: '',
      features: ['']
    }]
  );

  const [createdEvents, setCreatedEvents] = useState([]);
  const [createdServices, setCreatedServices] = useState([]);
  const [organizerBookings, setOrganizerBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('event');

  useEffect(() => {
    if (currentUser && currentUser.type === 'organizer') {
      fetchOrganizerEvents();
      fetchOrganizerServices();
      fetchOrganizerBookings();
    }
  }, [currentUser]);

  const fetchOrganizerEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/organizer/events');
      const data = response.data;
      setCreatedEvents(data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load events');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrganizerServices = async () => {
    try {
      const response = await axios.get('/organizer/services');
      const data = response.data;
      setCreatedServices(data.services || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load services');
      console.error('Error fetching services:', err);
    }
  };

  const fetchOrganizerBookings = async () => {
    try {
      setBookingsLoading(true);
      const response = await axios.get('/organizer/bookings');
      const data = response.data;
      setOrganizerBookings(data.bookings || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setBookingsLoading(false);
    }
  };

  const createEventInDB = async (eventData) => {
    try {
      const response = await axios.post('/organizer/events', eventData);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Error creating event');
    }
  };

  const createServiceInDB = async (serviceData) => {
    try {
      const response = await axios.post('/organizer/services', serviceData);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Error creating service');
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await axios.put(`/organizer/bookings/${bookingId}/status`, { status });
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Error updating booking status');
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const eventData = {
        name: eventName,
        date: eventDate,
        venue: eventVenue,
        description: eventDescription,
        packages: [
          {
            type: 'general',
            price: generalPrice,
            name: 'General Admission'
          },
          {
            type: 'vip',
            price: vipPrice,
            name: 'VIP'
          }]

      };

      const result = await createEventInDB(eventData);

      setSuccess(`Event "${eventName}" created successfully!`);

      setEventName('');
      setEventDate('');
      setEventVenue('');
      setEventDescription('');
      setGeneralPrice(0);
      setVipPrice(0);

      fetchOrganizerEvents();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const serviceData = {
        organizerName: serviceOrganizerName,
        serviceType: serviceType,
        location: serviceLocation,
        rating: serviceRating,
        description: serviceDescription,
        packages: servicePackages.map((pkg) => ({
          ...pkg,
          features: pkg.features.filter((feature) => feature.trim() !== '')
        }))
      };

      const result = await createServiceInDB(serviceData);

      setSuccess(`Service "${serviceOrganizerName}" created successfully!`);

      setServiceOrganizerName('');
      setServiceType('');
      setServiceLocation('');
      setServiceRating(0);
      setServiceDescription('');
      setServicePackages([{
        name: 'Basic Package',
        price: 0,
        description: '',
        features: ['']
      }]);

      fetchOrganizerServices();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleServicePackageChange = (index, field, value) => {
    const newPackages = [...servicePackages];
    newPackages[index] = {
      ...newPackages[index],
      [field]: value
    };
    setServicePackages(newPackages);
  };

  const handleServicePackageFeatureChange = (pkgIndex, featureIndex, value) => {
    const newPackages = [...servicePackages];
    const newFeatures = [...newPackages[pkgIndex].features];
    newFeatures[featureIndex] = value;
    newPackages[pkgIndex].features = newFeatures;
    setServicePackages(newPackages);
  };

  const addServicePackageFeature = (pkgIndex) => {
    const newPackages = [...servicePackages];
    newPackages[pkgIndex].features.push('');
    setServicePackages(newPackages);
  };

  const removeServicePackageFeature = (pkgIndex, featureIndex) => {
    const newPackages = [...servicePackages];
    newPackages[pkgIndex].features = newPackages[pkgIndex].features.filter((_, i) => i !== featureIndex);
    setServicePackages(newPackages);
  };

  const addServicePackage = () => {
    const newPackage = {
      name: '',
      price: 0,
      description: '',
      features: ['']
    };
    setServicePackages([...servicePackages, newPackage]);
  };

  const removeServicePackage = (index) => {
    if (servicePackages.length > 1) {
      const newPackages = servicePackages.filter((_, i) => i !== index);
      setServicePackages(newPackages);
    }
  };

  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status);
      setSuccess(`Booking ${status} successfully!`);
      fetchOrganizerBookings();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await axios.delete(`/organizer/events/${eventId}`);
        setCreatedEvents((prev) => prev.filter((event) => event._id !== eventId));
        setSuccess('Event deleted successfully!');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await axios.delete(`/organizer/services/${serviceId}`);
        setCreatedServices((prev) => prev.filter((service) => service._id !== serviceId));
        setSuccess('Service deleted successfully!');
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = organizerBookings.
    filter((booking) => booking.paymentStatus === 'paid').
    reduce((sum, booking) => sum + booking.totalAmount, 0);

  const pendingBookings = organizerBookings.filter((booking) => booking.status === 'pending').length;
  const confirmedBookings = organizerBookings.filter((booking) => booking.status === 'confirmed').length;

  if (!currentUser || currentUser.type !== 'organizer') {
    return <div className="container mx-auto p-8 text-center">Please log in as an organizer to view this page.</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Organizer Dashboard</h1>

      {error &&
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      }

      {success &&
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      }

      <div className="mb-6 border-b">
        <div className="flex space-x-4">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'event' ?
              'border-b-2 border-indigo-600 text-indigo-600' :
              'text-gray-500 hover:text-gray-700'}`
            }
            onClick={() => setActiveTab('event')}>

            Create Event
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'service' ?
              'border-b-2 border-indigo-600 text-indigo-600' :
              'text-gray-500 hover:text-gray-700'}`
            }
            onClick={() => setActiveTab('service')}>

            Create Service
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'bookings' ?
              'border-b-2 border-indigo-600 text-indigo-600' :
              'text-gray-500 hover:text-gray-700'}`
            }
            onClick={() => setActiveTab('bookings')}>

            Bookings ({organizerBookings.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {activeTab === 'event' &&
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Create New Public Event</h2>
              <form onSubmit={handleCreateEvent} className="space-y-6">
                <fieldset className="space-y-4">
                  <legend className="text-lg font-medium text-gray-900 mb-2">Event Details</legend>
                  <Input
                    label="Event Name"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    placeholder="e.g., Summer Music Festival"
                    required />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Date"
                      type="date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required />

                    <Input
                      label="Venue"
                      value={eventVenue}
                      onChange={(e) => setEventVenue(e.target.value)}
                      placeholder="e.g., City Park"
                      required />

                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Event Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                      placeholder="Tell attendees about the event..."
                      required />

                  </div>
                </fieldset>

                <fieldset className="space-y-4">
                  <legend className="text-lg font-medium text-gray-900 mb-2">Ticket Prices (₹)</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="General Admission Price"
                      type="number"
                      value={generalPrice}
                      onChange={(e) => setGeneralPrice(parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 999"
                      required />

                    <Input
                      label="VIP Price"
                      type="number"
                      value={vipPrice}
                      onChange={(e) => setVipPrice(parseFloat(e.target.value) || 0)}
                      placeholder="e.g., 1999"
                      required />

                  </div>
                </fieldset>

                <Button
                  type="submit"
                  className="w-full text-lg py-3"
                  disabled={loading}>

                  {loading ? 'Creating Event...' : 'Create Event'}
                </Button>
              </form>
            </Card>
          }

          {activeTab === 'service' &&
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Create New Service</h2>
              <form onSubmit={handleCreateService} className="space-y-6">
                <fieldset className="space-y-4">
                  <legend className="text-lg font-medium text-gray-900 mb-2">Service Details</legend>
                  <Input
                    label="Organizer/Business Name"
                    value={serviceOrganizerName}
                    onChange={(e) => setServiceOrganizerName(e.target.value)}
                    placeholder="e.g., Perfect Weddings Co."
                    required />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Service Type"
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                      placeholder="e.g., Wedding Planning, Photography"
                      required />

                    <Input
                      label="Location"
                      value={serviceLocation}
                      onChange={(e) => setServiceLocation(e.target.value)}
                      placeholder="e.g., Mumbai, India"
                      required />

                  </div>
                  <Input
                    label="Rating (0-5)"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={serviceRating}
                    onChange={(e) => setServiceRating(parseFloat(e.target.value))}
                    placeholder="e.g., 4.5" />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service Description
                    </label>
                    <textarea
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      placeholder="Describe your service..."
                      required />

                  </div>
                </fieldset>

                <fieldset>
                  <legend className="text-lg font-medium text-gray-900 mb-2">Service Packages</legend>
                  <div className="space-y-6">
                    {servicePackages.map((pkg, pkgIndex) =>
                      <div key={pkgIndex} className="border p-4 rounded-md bg-gray-50 relative">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <Input
                            label="Package Name"
                            value={pkg.name}
                            onChange={(e) => handleServicePackageChange(pkgIndex, 'name', e.target.value)}
                            placeholder="e.g., Premium Wedding Package"
                            required />

                          <Input
                            label="Price (₹)"
                            type="number"
                            value={pkg.price}
                            onChange={(e) => handleServicePackageChange(pkgIndex, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="e.g., 50000"
                            required />

                        </div>
                        <div className="mb-4">
                          <Input
                            label="Package Description"
                            value={pkg.description}
                            onChange={(e) => handleServicePackageChange(pkgIndex, 'description', e.target.value)}
                            placeholder="Describe what this package includes"
                            required />

                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Package Features</label>
                          <div className="space-y-2">
                            {pkg.features.map((feature, featureIndex) =>
                              <div key={featureIndex} className="flex gap-2 items-center">
                                <Input
                                  value={feature}
                                  onChange={(e) => handleServicePackageFeatureChange(pkgIndex, featureIndex, e.target.value)}
                                  placeholder="e.g., 8 hours of coverage"
                                  required />

                                {pkg.features.length > 1 &&
                                  <button
                                    type="button"
                                    onClick={() => removeServicePackageFeature(pkgIndex, featureIndex)}
                                    className="px-3 py-2 text-red-500 hover:text-red-700 font-bold">

                                    ✕
                                  </button>
                                }
                              </div>
                            )}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addServicePackageFeature(pkgIndex)}>

                              Add Feature
                            </Button>
                          </div>
                        </div>

                        {servicePackages.length > 1 &&
                          <button
                            type="button"
                            onClick={() => removeServicePackage(pkgIndex)}
                            className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold">

                            ✕
                          </button>
                        }
                      </div>
                    )}
                    <Button type="button" variant="outline" onClick={addServicePackage}>
                      Add Another Package
                    </Button>
                  </div>
                </fieldset>

                <Button
                  type="submit"
                  className="w-full text-lg py-3"
                  disabled={loading}>

                  {loading ? 'Creating Service...' : 'Create Service'}
                </Button>
              </form>
            </Card>
          }

          {activeTab === 'bookings' &&
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Bookings Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{organizerBookings.length}</p>
                    <p className="text-gray-600">Total Bookings</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                    <p className="text-gray-600">Total Revenue</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <p className="text-2xl font-bold text-yellow-600">{pendingBookings}</p>
                    <p className="text-gray-600">Pending Approval</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Recent Bookings</h2>
                {bookingsLoading ?
                  <div className="text-center py-8">Loading bookings...</div> :
                  organizerBookings.length === 0 ?
                    <div className="text-center py-8 text-gray-500">
                      No bookings yet. Your bookings will appear here when customers book your events or services.
                    </div> :

                    <div className="space-y-4">
                      {organizerBookings.map((booking) =>
                        <div key={booking._id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="font-bold text-lg">
                                {booking.type === 'event' ? booking.event?.name : booking.service?.organizerName}
                              </h3>
                              <p className="text-gray-600">
                                {booking.type === 'event' ? 'Event' : 'Service'} •
                                Booked by: {booking.user.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {booking.user.email} • {booking.user.phone}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                                {booking.status}
                              </span>
                              <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                {booking.paymentStatus}
                              </span>
                              <p className="text-lg font-bold text-green-600 mt-1">
                                ₹{booking.totalAmount.toLocaleString()}
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                            <div>
                              <span className="font-medium">Package:</span>
                              <p>{booking.package.name} (₹{booking.package.price.toLocaleString()})</p>
                            </div>
                            <div>
                              <span className="font-medium">Quantity:</span>
                              <p>{booking.quantity}</p>
                            </div>
                          </div>

                          {booking.customerNotes &&
                            <div className="mb-3">
                              <span className="font-medium text-sm">Customer Notes:</span>
                              <p className="text-sm text-gray-600">{booking.customerNotes}</p>
                            </div>
                          }

                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-500">
                              Booked on: {new Date(booking.bookingDate).toLocaleDateString()}
                            </p>

                            <div className="flex space-x-2">
                              {booking.status === 'pending' &&
                                <>
                                  <Button
                                    size="sm"
                                    onClick={() => handleBookingStatusUpdate(booking._id, 'confirmed')}>

                                    Accept
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBookingStatusUpdate(booking._id, 'cancelled')}
                                    className="text-red-600 border-red-300">

                                    Reject
                                  </Button>
                                </>
                              }
                              {booking.status === 'confirmed' &&
                                <Button
                                  size="sm"
                                  onClick={() => handleBookingStatusUpdate(booking._id, 'completed')}>

                                  Mark Complete
                                </Button>
                              }
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                }
              </Card>
            </div>
          }

          {activeTab !== 'bookings' &&
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Created Events ({createdEvents.length})</h2>
              {loading ?
                <div className="text-center py-4">Loading events...</div> :

                <div className="space-y-4">
                  {createdEvents.map((event) =>
                    <div key={event._id} className="border rounded-lg p-4 flex justify-between items-center">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg">{event.name}</h3>
                        <p className="text-gray-600">{event.date} • {event.venue}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          General: ₹{event.packages.find((p) => p.type === 'general')?.price || 0} •
                          VIP: ₹{event.packages.find((p) => p.type === 'vip')?.price || 0}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Created: {new Date(event.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEventName(event.name);
                            setEventDate(event.date);
                            setEventVenue(event.venue);
                            setEventDescription(event.description);
                            setGeneralPrice(event.packages.find((p) => p.type === 'general')?.price || 0);
                            setVipPrice(event.packages.find((p) => p.type === 'vip')?.price || 0);
                            setActiveTab('event');
                          }}>

                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteEvent(event._id)}
                          className="text-red-600 border-red-300 hover:bg-red-50">

                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                  {createdEvents.length === 0 && !loading && activeTab === 'event' &&
                    <p className="text-gray-500 text-center py-4">No events created yet. Create your first event above!</p>
                  }
                </div>
              }
            </Card>
          }

          {activeTab !== 'bookings' &&
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Created Services ({createdServices.length})</h2>
              <div className="space-y-4">
                {createdServices.map((service) =>
                  <div key={service._id} className="border rounded-lg p-4 flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{service.organizerName}</h3>
                      <p className="text-gray-600">{service.serviceType} • {service.location}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Rating: {service.rating}★ • Packages: {service.packages.length}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        Created: {new Date(service.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setServiceOrganizerName(service.organizerName);
                          setServiceType(service.serviceType);
                          setServiceLocation(service.location);
                          setServiceRating(service.rating);
                          setServiceDescription(service.description);
                          setServicePackages(service.packages);
                          setActiveTab('service');
                        }}>

                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteService(service._id)}
                        className="text-red-600 border-red-300 hover:bg-red-50">

                        Delete
                      </Button>
                    </div>
                  </div>
                )}
                {createdServices.length === 0 && !loading && activeTab === 'service' &&
                  <p className="text-gray-500 text-center py-4">No services created yet. Create your first service above!</p>
                }
              </div>
            </Card>
          }
        </div>

        <div className="lg:col-span-1">
          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Business Overview</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-sm">Total Events</p>
                <p className="text-2xl font-bold text-blue-600">{createdEvents.length}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Services</p>
                <p className="text-2xl font-bold text-green-600">{createdServices.length}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-purple-600">{organizerBookings.length}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Confirmed Bookings</p>
                <p className="text-2xl font-bold text-green-600">{confirmedBookings}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setActiveTab('bookings')}>

                📋 View All Bookings
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setActiveTab('event')}>

                🎪 Create New Event
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => setActiveTab('service')}>

                💼 Create New Service
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {organizerBookings.slice(0, 3).map((booking) =>
                <div key={booking._id} className="flex items-center space-x-3 text-sm">
                  <div className={`w-2 h-2 rounded-full ${booking.status === 'confirmed' ? 'bg-green-500' :
                    booking.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'}`
                  }></div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">
                      {booking.type === 'event' ? booking.event?.name : booking.service?.organizerName}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {booking.user.name} • ₹{booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
              {organizerBookings.length === 0 &&
                <p className="text-gray-500 text-sm">No recent activity</p>
              }
            </div>
          </Card>
        </div>
      </div>
    </div>);

};

export default OrganizerDashboardPage;