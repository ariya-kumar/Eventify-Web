import React, { useState, useEffect } from 'react';
import ServiceListItem from '../../components/ServiceListItem';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Button from '../../components/ui/Button';
import axios from '../../src/utils/axios';

const SearchPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [eventType, setEventType] = useState('');
  const [location, setLocation] = useState('');
  const [minRating, setMinRating] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/user/services');

        const data = response.data;
        setServices(data.services || []);
        setFilteredServices(data.services || []);
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleSearch = () => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter((service) =>
        service.organizerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (eventType) {
      filtered = filtered.filter((service) =>
        service.serviceType.toLowerCase() === eventType.toLowerCase() ||
        service.serviceType.toLowerCase().includes(eventType.toLowerCase())
      );
    }

    if (location) {
      filtered = filtered.filter((service) =>
        service.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    if (minRating) {
      const ratingValue = parseFloat(minRating);
      filtered = filtered.filter((service) => (service.rating || 0) >= ratingValue);
    }

    setFilteredServices(filtered);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setEventType('');
    setLocation('');
    setMinRating('');
    setFilteredServices(services);
  };

  const defaultServiceTypes = ['Wedding', 'Birthday Parties', 'Catering', 'Photography', 'Venue', 'Decor & Lighting', 'Live Music & DJ', 'Event Planning'];
  const dbServiceTypes = services.map((service) => service.serviceType);
  const allServiceTypes = [...new Set([...defaultServiceTypes, ...dbServiceTypes])];
  const uniqueLocations = [...new Set(services.map((service) => service.location))];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Find the Perfect Event Service</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
        <Input
          label="Search by Name / Keyword"
          id="search-name"
          placeholder="e.g., Wedding, Catering"
          className="lg:col-span-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <Select
          label="Service Type"
          id="service-type"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
        >
          <option value="">All Service Types</option>
          {allServiceTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
        
        <Select
          label="Location"
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {uniqueLocations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </Select>

        <Select
          label="Minimum Rating"
          id="min-rating"
          value={minRating}
          onChange={(e) => setMinRating(e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="4.0">4.0 ★ & above</option>
          <option value="4.5">4.5 ★ & above</option>
          <option value="4.8">4.8 ★ & above</option>
          <option value="5.0">5.0 ★ Only</option>
        </Select>
        
        <div className="flex space-x-2">
          <Button
            className="w-full"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Apply Filters'}
          </Button>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
          </h2>
          {(searchTerm || eventType || location || minRating) && (
            <button
              onClick={handleClearFilters}
              className="text-sm text-indigo-600 hover:text-indigo-800 underline font-medium"
            >
              Reset All Filters
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-600 text-lg">No services found matching your criteria.</p>
            <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
            <Button
              onClick={handleClearFilters}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div>
            {filteredServices.map((service) => (
              <ServiceListItem
                key={service._id}
                service={{
                  id: service._id,
                  name: service.organizerName,
                  type: service.serviceType,
                  location: service.location,
                  rating: service.rating,
                  description: service.description,
                  price: Math.min(...service.packages.map((p) => p.price)),
                  packages: service.packages.length
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;