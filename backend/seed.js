require('dotenv').config();
const { faker } = require('@faker-js/faker');
const connectDB = require('./config/db');
const User = require('./models/User');
const Organizer = require('./models/Organizer');
const Event = require('./models/Event');
const Service = require('./models/Service');
const Booking = require('./models/Booking');

connectDB();

const seedDatabase = async () => {
  try {
    await User.deleteMany({});
    await Organizer.deleteMany({});
    await Event.deleteMany({});
    await Service.deleteMany({});
    await Booking.deleteMany({});
    
    console.log('Existing database records cleared.');

    const usersData = [
      { name: 'Karthik Raja', email: 'user@example.com', phone: '9876543210', password: 'password123' },
      { name: 'Ananya Sundaram', email: 'ananya.s@gmail.com', phone: '9840123456', password: 'password123' },
      { name: 'Venkatesh Kumar', email: 'venkat.k@gmail.com', phone: '9790123456', password: 'password123' },
      { name: 'Priya Ramachandran', email: 'priya.r@gmail.com', phone: '9884123456', password: 'password123' },
      { name: 'Senthil Nathan', email: 'senthil.n@gmail.com', phone: '9443123456', password: 'password123' },
      { name: 'Divya Vijay', email: 'divya.v@gmail.com', phone: '9940123456', password: 'password123' },
      { name: 'Arun Prakash', email: 'arun.p@gmail.com', phone: '9842123456', password: 'password123' }
    ];

    const users = [];
    for (const u of usersData) {
      users.push(await User.create(u));
    }
    console.log(`Created ${users.length} Users.`);

    const organizersData = [
      { businessName: 'Chennai Wedding Planners', email: 'organizer@example.com', phone: '9840011223', serviceType: 'Wedding', password: 'password123' },
      { businessName: 'FunTimes Birthday & Kids Parties', email: 'birthday@example.com', phone: '9840011224', serviceType: 'Birthday Parties', password: 'password123' },
      { businessName: 'Madurai Chettinad Caterers', email: 'maduraicaterers@gmail.com', phone: '9443011223', serviceType: 'Catering', password: 'password123' },
      { businessName: 'Kongu Mandapam & Decorators', email: 'kongudecorators@gmail.com', phone: '9842011223', serviceType: 'Decor & Lighting', password: 'password123' },
      { businessName: 'Kovai Sound & DJ Entertainment', email: 'kovaibeats@gmail.com', phone: '9790011223', serviceType: 'Live Music & DJ', password: 'password123' },
      { businessName: 'Trichy Royal Studios & Videography', email: 'trichyphoto@gmail.com', phone: '9884011223', serviceType: 'Photography', password: 'password123' },
      { businessName: 'Marina Palace Convention Center', email: 'marinapalace@gmail.com', phone: '9940011223', serviceType: 'Venue', password: 'password123' }
    ];

    const organizers = [];
    for (const o of organizersData) {
      organizers.push(await Organizer.create(o));
    }
    console.log(`Created ${organizers.length} Organizers.`);

    const tnEvents = [
      {
        name: 'Chennai Margazhi Music & Dance Festival 2026',
        venue: 'Narada Gana Sabha, Alwarpet, Chennai',
        date: '2026-12-15T18:00:00.000Z',
        desc: 'Experience the world-renowned Margazhi Isai Vizha featuring legendary Carnatic vocalists, veena recitalists, and Bharatanatyam exponents in Chennai.',
        capacity: 800,
        packages: [
          { type: 'general', name: 'Standard Seat', price: 350 },
          { type: 'vip', name: 'Front Row VIP Pass + Prasadam Box', price: 1200 }
        ],
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'
      },
      {
        name: 'Grand Pongal Cultural Carnival & Food Fest',
        venue: 'VOC Park Grounds, Race Course, Coimbatore',
        date: '2026-01-14T10:00:00.000Z',
        desc: 'A grand celebration of Tamil harvest festival featuring traditional Sakkarai Pongal preparation, Oyilattam, Mayilattam, and village folk arts.',
        capacity: 1500,
        packages: [
          { type: 'general', name: 'Single Entry Ticket', price: 150 },
          { type: 'vip', name: 'Family Combo Pass (Includes Food Tokens)', price: 600 }
        ],
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80'
      },
      {
        name: 'Coimbatore Tech & Startup Conclave 2026',
        venue: 'CODISSIA Trade Fair Complex, Avinashi Road, Coimbatore',
        date: '2026-10-20T09:30:00.000Z',
        desc: 'Tamil Nadu’s largest startup and technology summit showcasing AI innovations, SaaS products, and networking with top VCs and founders.',
        capacity: 1200,
        packages: [
          { type: 'general', name: 'Delegate Pass', price: 799 },
          { type: 'vip', name: 'Investor & Founder VIP Ticket', price: 2499 }
        ],
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80'
      },
      {
        name: 'Mahabalipuram Beachside Dance Festival',
        venue: 'Shore Temple Complex, Mamallapuram',
        date: '2026-11-05T17:30:00.000Z',
        desc: 'Open-air classical dance festival set against the historic UNESCO World Heritage Shore Temple overlooking the Bay of Bengal.',
        capacity: 600,
        packages: [
          { type: 'general', name: 'Open Seating Pass', price: 250 },
          { type: 'vip', name: 'Reserved Seating + Souvenir', price: 850 }
        ],
        image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800&q=80'
      },
      {
        name: 'Madurai Chithirai Thiruvizha & Heritage Expo',
        venue: 'Tamukkam Ground, KK Nagar, Madurai',
        date: '2026-04-18T16:00:00.000Z',
        desc: 'Celebration of Madurai’s iconic Chithirai festival with traditional handicraft stalls, Temple architecture exhibitions, and Madurai special street food.',
        capacity: 2000,
        packages: [
          { type: 'general', name: 'General Entry', price: 100 },
          { type: 'vip', name: 'VIP Priority Pavilion', price: 499 }
        ],
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80'
      },
      {
        name: 'Tamil Isai Mazhai Live Concert by Anirudh & Band',
        venue: 'Nehru Indoor Stadium, Periamet, Chennai',
        date: '2026-09-25T18:30:00.000Z',
        desc: 'High-energy Tamil live concert featuring sensational chartbusters, laser show visuals, and top playback singers.',
        capacity: 5000,
        packages: [
          { type: 'general', name: 'Silver Arena Stand', price: 999 },
          { type: 'vip', name: 'Fan Zone VIP Row', price: 3499 }
        ],
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'
      }
    ];

    const events = [];
    for (let i = 0; i < tnEvents.length; i++) {
      const e = tnEvents[i];
      const organizer = organizers[i % organizers.length];
      const newEvent = await Event.create({
        name: e.name,
        date: e.date,
        venue: e.venue,
        description: e.desc,
        capacity: e.capacity,
        availableTickets: e.capacity,
        organizer: organizer._id,
        packages: e.packages,
        gallery: [{ url: e.image, filename: 'event.jpg' }]
      });
      events.push(newEvent);
    }
    console.log(`Created ${events.length} Events.`);

    const tnServices = [
      {
        name: 'Royal Heritage Wedding Planners',
        type: 'Wedding',
        location: 'Chennai, Tamil Nadu',
        rating: 5.0,
        desc: 'End-to-end luxury wedding management specializing in South Indian traditional Muhurtham, destination beach weddings in ECR, and royal palace theme receptions.',
        packages: [
          {
            name: 'Classic Wedding Planning',
            price: 85000,
            description: 'Full coordination for Muhurtham & Reception.',
            features: ['Muhurtham Coordination', 'Vendor Management', 'Guest Hospitality & Transport']
          },
          {
            name: 'Royal Destination Wedding Package',
            price: 250000,
            description: 'Complete 3-day luxury wedding orchestration.',
            features: ['Pre-wedding, Sangeet & Muhurtham', 'Theme Design & Setup', 'VIP Concierge Service', 'Drone Videography']
          }
        ]
      },
      {
        name: 'Magic & Joy Kids Birthday Planners',
        type: 'Birthday Parties',
        location: 'Coimbatore, Tamil Nadu',
        rating: 4.8,
        desc: 'Unforgettable themed birthday party setups, balloon arches, magician & clown shows, mascot appearances, and customized birthday cake counters.',
        packages: [
          {
            name: 'Sparkle Birthday Package',
            price: 18000,
            description: 'Theme balloon decor, 2-hour magician show, and party games.',
            features: ['Balloon Arch & Stage Setup', 'Professional Magician Show', 'Game Host & Return Gifts']
          },
          {
            name: 'Grand Cartoon Theme Extravaganza',
            price: 45000,
            description: '3D cartoon backdrop, live cotton candy & popcorn stalls, DJ sound & photo booth.',
            features: ['3D Theme Stage Setup', 'Mascot & Live Stalls', 'Photo Booth & Instant Album', 'DJ Sound & Bubble Machine']
          }
        ]
      },
      {
        name: 'Chettinad Traditional Marriage Feast Catering',
        type: 'Catering',
        location: 'Chennai & Karaikudi, Tamil Nadu',
        rating: 4.9,
        desc: 'Authentic 30-item traditional Tamil Kalyana Saapadu served on fresh banana leaves (Elai Saapadu) including Chettinad Vada, Payasam, and Biryani.',
        packages: [
          {
            name: 'Standard Kalyana Saapadu (100 Guests)',
            price: 45000,
            description: 'Full traditional lunch menu with 22 items served on fresh banana leaves.',
            features: ['22 Traditional Menu Items', 'Banana Leaf & Table Setup', 'Uniformed Serving Staff']
          },
          {
            name: 'Royal Chettinad Grand Feast (300 Guests)',
            price: 135000,
            description: '30-item lavish Chettinad feast including welcome drinks, live Dosa & Sweet counters.',
            features: ['30 Special Menu Items', 'Live Dosa & Sweet Counters', 'VIP Table Service', 'Ice Cream & Beeda Stall']
          }
        ]
      },
      {
        name: 'Madurai Royal Cinematic Wedding Photography',
        type: 'Photography',
        location: 'Madurai & Trichy, Tamil Nadu',
        rating: 4.5,
        desc: 'Specialized South Indian wedding photography capturing Muhurtham moments, candid bridal portraits, Koorai Saree rituals, and 4K aerial drone film.',
        packages: [
          {
            name: 'Muhurtham & Reception Package',
            price: 65000,
            description: '2-Day coverage for Wedding Muhurtham & Evening Reception.',
            features: ['4K Video & Candid Photography', '2 Photographers + 2 Videographers', 'Canvera Premium Album (40 Pages)', 'Teaser Video (3 mins)']
          }
        ]
      },
      {
        name: 'Kongu Traditional Mandapam & Floral Decorators',
        type: 'Decor & Lighting',
        location: 'Coimbatore & Erode, Tamil Nadu',
        rating: 4.2,
        desc: 'Traditional South Indian wedding stage decoration with fresh Mallipoo (Jasmine), Marigold arches, banana tree entrance setup, and brass Vilakku setup.',
        packages: [
          {
            name: 'Traditional Jasmine & Rose Mandapam',
            price: 55000,
            description: 'Authentic South Indian floral stage with traditional brass Vilakku entrance.',
            features: ['Fresh Jasmine & Rose Stage Backdrop', 'Banana Tree Entrance Arch', 'Red Carpet Walkway']
          }
        ]
      },
      {
        name: 'Chennai Nadaswaram & Mangala Isai Troupe',
        type: 'Live Music & DJ',
        location: 'Chennai, Tamil Nadu',
        rating: 4.0,
        desc: 'Renowned Vidwans providing traditional Nadaswaram & Thavil Mangala Isai for Muhurtham rituals, paired with evening Carnatic instrumental fusion.',
        packages: [
          {
            name: 'Traditional Muhurtham Nadaswaram',
            price: 25000,
            description: '5-member Nadaswaram & Thavil ensemble for 4 hours Muhurtham ceremony.',
            features: ['5 Expert Musicians', 'Traditional Silk Attire', 'Continuous Muhurtham Isai']
          }
        ]
      },
      {
        name: 'Sri Krishna Grand Marriage Hall & Convention Center',
        type: 'Venue',
        location: 'Anna Nagar, Chennai, Tamil Nadu',
        rating: 4.8,
        desc: 'Luxury centralized AC marriage hall with 1000 seating capacity, 300 dining capacity, modern kitchen, and 15 AC guest rooms.',
        packages: [
          {
            name: 'Single Session Rental (12 Hours)',
            price: 150000,
            description: 'Ideal for Evening Reception or Morning Muhurtham.',
            features: ['Air-Conditioned Hall (1000 Capacity)', 'Dining Hall (300 Capacity)', '5 Complimentary AC Rooms']
          }
        ]
      },
      {
        name: 'Kovai Beats DJ & Parai Isai Celebration Group',
        type: 'Live Music & DJ',
        location: 'Coimbatore & Salem, Tamil Nadu',
        rating: 4.6,
        desc: 'High-octane Tamil DJ music for wedding receptions combined with traditional Parai Isai and Chenda Melam folk performances.',
        packages: [
          {
            name: 'Reception DJ & Party Lighting',
            price: 20000,
            description: '4-hour DJ performance with popular Tamil, Kuthu & Bollywood hits.',
            features: ['Professional DJ & Emcee', 'JBL Sound System', 'Moving Head Intelligent Lights']
          }
        ]
      }
    ];

    const services = [];
    for (let i = 0; i < tnServices.length; i++) {
      const s = tnServices[i];
      const organizer = organizers[i % organizers.length];
      const newService = await Service.create({
        organizerName: s.name,
        serviceType: s.type,
        location: s.location,
        rating: s.rating,
        description: s.desc,
        packages: s.packages,
        portfolioImages: [{ url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80', filename: 'service.jpg' }],
        organizer: organizer._id,
        isActive: true
      });
      services.push(newService);
    }
    console.log(`Created ${services.length} Services including Wedding & Birthday Parties.`);

    for (let i = 0; i < 8; i++) {
      const user = users[i % users.length];
      if (i % 2 === 0 && events.length > 0) {
        const event = events[i % events.length];
        const pkg = event.packages[0];
        await Booking.create({
          user: user._id,
          event: event._id,
          type: 'event',
          ticketType: pkg.type,
          quantity: 2,
          package: { name: pkg.name, price: pkg.price },
          totalAmount: pkg.price * 2,
          status: 'confirmed',
          paymentStatus: 'paid',
          customerNotes: 'Please email e-tickets to my mobile.'
        });
      } else if (services.length > 0) {
        const service = services[i % services.length];
        const pkg = service.packages[0];
        await Booking.create({
          user: user._id,
          service: service._id,
          type: 'service',
          quantity: 1,
          package: { name: pkg.name, price: pkg.price },
          totalAmount: pkg.price,
          status: 'pending',
          paymentStatus: 'pending',
          customerNotes: 'Function date is confirmed for next month.'
        });
      }
    }
    console.log('Created sample Bookings.');

    console.log('\n====================================================');
    console.log('✅ Database successfully seeded with Wedding & Birthday Parties data!');
    console.log('====================================================');
    console.log('Sample User Login:      user@example.com      / password123');
    console.log('Sample Organizer Login: organizer@example.com / password123');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
