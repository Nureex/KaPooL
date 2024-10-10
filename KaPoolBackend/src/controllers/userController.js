const User = require('../models/User');

const signUp = async (req, res) => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).json({ status: 'error', message: 'Email is already registered' });
  }

  const newUser = new User(req.body);

  try {
    const savedUser = await newUser.save();
    res.status(201).json({ status: 'success', message: 'User registered successfully', user: savedUser });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Registration failed', error: error.message });
  }

}


const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }


    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ status: 'success', message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Login failed', error: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = { 
  signUp,
  logIn,
  getUserById
}