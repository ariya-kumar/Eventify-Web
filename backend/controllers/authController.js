const User = require('../models/User');
const Organizer = require('../models/Organizer');
const bcrypt = require('bcryptjs');
const { signToken, verifyToken } = require('../utils/jwtUtils');

exports.registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    console.log('Received registration data:', req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User already exists with this email' 
      });
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      password
    });

    console.log('New user created in MongoDB:', newUser);

    const token = signToken(newUser._id, 'user');

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          type: 'user'
        }
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        status: 'error',
        message: 'User already exists with this email' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        status: 'error',
        message: messages.join(', ') 
      });
    }
    
    res.status(400).json({ 
      status: 'error',
      message: error.message 
    });
  }
};

exports.registerOrganizer = async (req, res) => {
  try {
    const { businessName, email, phone, serviceType, password } = req.body;

    console.log('Received organizer registration data:', req.body);

    const existingOrganizer = await Organizer.findOne({ email });
    if (existingOrganizer) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Organizer already exists with this email' 
      });
    }

    const newOrganizer = await Organizer.create({
      businessName,
      email,
      phone,
      serviceType,
      password
    });

    console.log('New organizer created in MongoDB:', newOrganizer);

    const token = signToken(newOrganizer._id, 'organizer');

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: {
          id: newOrganizer._id,
          name: newOrganizer.businessName,
          email: newOrganizer.email,
          type: 'organizer'
        }
      }
    });

  } catch (error) {
    console.error('Organizer registration error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Organizer already exists with this email' 
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        status: 'error',
        message: messages.join(', ') 
      });
    }
    
    res.status(400).json({ 
      status: 'error',
      message: error.message 
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, isOrganizer } = req.body;

    console.log('Login attempt:', { email, isOrganizer });

    if (!email || !password) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Please provide email and password' 
      });
    }

    let user;
    if (isOrganizer) {
      user = await Organizer.findOne({ email });
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      console.log('User not found with email:', email);
      return res.status(401).json({ 
        status: 'error',
        message: 'Incorrect email or password' 
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password validation result:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ 
        status: 'error',
        message: 'Incorrect email or password' 
      });
    }

    console.log('Login successful for user:', email);

    const token = signToken(user._id, isOrganizer ? 'organizer' : 'user');

    res.json({
      status: 'success',
      token,
      data: {
        user: {
          id: user._id,
          name: user.name || user.businessName,
          email: user.email,
          type: isOrganizer ? 'organizer' : 'user'
        }
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({ 
      status: 'error',
      message: error.message 
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ status: 'error', message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    let user;
    if (decoded.type === 'organizer') {
      user = await Organizer.findById(decoded.id).select('-password');
      if (!user) return res.status(404).json({ status: 'error', message: 'Organizer not found' });
      return res.json({
        status: 'success',
        data: { user: { id: user._id, name: user.businessName, email: user.email, type: 'organizer' } }
      });
    } else {
      user = await User.findById(decoded.id).select('-password');
      if (!user) return res.status(404).json({ status: 'error', message: 'User not found' });
      return res.json({
        status: 'success',
        data: { user: { id: user._id, name: user.name, email: user.email, type: 'user' } }
      });
    }
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};
