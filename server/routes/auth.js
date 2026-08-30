const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'solex_super_secret_jwt_key_2024';
const USERS_FILE = path.join(__dirname, '../data/users.json');
const MAIL_FILE = path.join(__dirname, '../data/mail_inbox.json');

// Helper to read JSON
function readData(file, defaultVal = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultVal, null, 2));
      return defaultVal;
    }
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('Error reading file:', file, err);
    return defaultVal;
  }
}

// Helper to write JSON
function writeData(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error writing file:', file, err);
  }
}

// Seed default demo user if empty
(function seedUsers() {
  const users = readData(USERS_FILE, []);
  if (users.length === 0) {
    const salt = bcrypt.genSaltSync(10);
    const defaultPasswordHash = bcrypt.hashSync('SolexUser123!', salt);
    users.push({
      id: 'user-demo-1',
      name: 'Alex Rivera',
      email: 'alex.rivera@example.com',
      password: defaultPasswordHash,
      role: 'customer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      phone: '+1 (555) 234-5678',
      address: {
        street: '742 Evergreen Terrace',
        city: 'Portland',
        state: 'OR',
        zipCode: '97201',
        country: 'United States'
      },
      createdAt: new Date().toISOString()
    });
    writeData(USERS_FILE, users);
  }
})();

// Helper to send simulated/actual email
function sendSimulatedMail({ to, subject, type, body, resetToken, resetUrl }) {
  const inbox = readData(MAIL_FILE, []);
  const mailItem = {
    id: 'mail-' + uuidv4(),
    to,
    subject,
    type, // 'password_reset', 'order_confirmation', etc.
    body,
    resetToken,
    resetUrl,
    timestamp: new Date().toISOString(),
    read: false
  };
  inbox.unshift(mailItem);
  // Keep last 50 emails
  if (inbox.length > 50) inbox.pop();
  writeData(MAIL_FILE, inbox);
  return mailItem;
}

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    const users = readData(USERS_FILE, []);
    const normalizedEmail = email.trim().toLowerCase();

    if (users.find(u => u.email.toLowerCase() === normalizedEmail)) {
      return res.status(409).json({ error: 'An account with this email address already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      id: 'user-' + uuidv4(),
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: 'customer',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    writeData(USERS_FILE, users);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });

    // Send welcome email
    sendSimulatedMail({
      to: newUser.email,
      subject: 'Welcome to SOLEX — Step Into Greatness',
      type: 'welcome',
      body: `Hi ${newUser.name},\n\nWelcome to SOLEX! Your account has been created successfully. Enjoy free shipping on orders over $100 and exclusive access to new sneaker drops.\n\nBest,\nThe SOLEX Team`
    });

    const userPayload = { ...newUser };
    delete userPayload.password;

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: userPayload
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const users = readData(USERS_FILE, []);
    const user = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });

    const userPayload = { ...user };
    delete userPayload.password;

    res.json({
      message: 'Logged in successfully!',
      token,
      user: userPayload
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const users = readData(USERS_FILE, []);
    const normalizedEmail = email.trim().toLowerCase();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === normalizedEmail);

    if (userIndex === -1) {
      // For security, do not expose if user exists or not, but return friendly confirmation
      return res.status(200).json({
        message: 'If an account exists with this email, password reset instructions have been sent.',
        emailSent: false
      });
    }

    const user = users[userIndex];
    // Generate secure 6-digit reset code and token
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = uuidv4();
    const resetExpires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

    users[userIndex].resetPasswordToken = resetToken;
    users[userIndex].resetPasswordCode = resetCode;
    users[userIndex].resetPasswordExpires = resetExpires;
    writeData(USERS_FILE, users);

    const resetUrl = `http://localhost:5173/?resetToken=${resetToken}&code=${resetCode}#reset-password`;

    const mailItem = sendSimulatedMail({
      to: user.email,
      subject: 'SOLEX — Password Reset Request',
      type: 'password_reset',
      body: `Hello ${user.name},\n\nWe received a request to reset your SOLEX password.\n\nYour 6-digit Verification Code is: ${resetCode}\n\nOr click the secure reset link below:\n${resetUrl}\n\nThis code and link will expire in 60 minutes. If you did not request this, you can safely ignore this email.\n\nBest regards,\nSOLEX Security Team`,
      resetToken,
      resetUrl
    });

    res.status(200).json({
      message: 'Password reset instructions have been sent to your email.',
      emailSent: true,
      email: user.email,
      debugMail: {
        id: mailItem.id,
        code: resetCode,
        resetToken: resetToken,
        timestamp: mailItem.timestamp
      }
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Failed to process forgot password request.' });
  }
});

// RESET PASSWORD (via Token or Code)
router.post('/reset-password', async (req, res) => {
  try {
    const { token, code, newPassword } = req.body;
    if ((!token && !code) || !newPassword) {
      return res.status(400).json({ error: 'Reset token or verification code and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const users = readData(USERS_FILE, []);
    const now = new Date();

    const userIndex = users.findIndex(u => {
      const matchToken = token && u.resetPasswordToken === token;
      const matchCode = code && u.resetPasswordCode === code;
      const notExpired = u.resetPasswordExpires && new Date(u.resetPasswordExpires) > now;
      return (matchToken || matchCode) && notExpired;
    });

    if (userIndex === -1) {
      return res.status(400).json({ error: 'Invalid or expired password reset link/code. Please request a new one.' });
    }

    const salt = await bcrypt.genSalt(10);
    users[userIndex].password = await bcrypt.hash(newPassword, salt);
    delete users[userIndex].resetPasswordToken;
    delete users[userIndex].resetPasswordCode;
    delete users[userIndex].resetPasswordExpires;

    writeData(USERS_FILE, users);

    // Send confirmation email
    sendSimulatedMail({
      to: users[userIndex].email,
      subject: 'SOLEX — Your Password Has Been Changed',
      type: 'password_changed',
      body: `Hello ${users[userIndex].name},\n\nYour SOLEX account password was successfully reset. You can now log in using your new credentials.\n\nIf you did not perform this change, contact support immediately.\n\nBest,\nSOLEX Security Team`
    });

    res.status(200).json({
      message: 'Password has been successfully updated! You can now log in.'
    });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Failed to reset password.' });
  }
});

// CHANGE PASSWORD (Authenticated User)
router.post('/change-password', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized. Please login.' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters.' });
    }

    const users = readData(USERS_FILE, []);
    const userIndex = users.findIndex(u => u.id === decoded.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = users[userIndex];
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password does not match.' });
    }

    const salt = await bcrypt.genSalt(10);
    users[userIndex].password = await bcrypt.hash(newPassword, salt);
    writeData(USERS_FILE, users);

    res.status(200).json({
      message: 'Password updated successfully!'
    });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ error: 'Failed to change password.' });
  }
});

// UPDATE PROFILE
router.put('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized.' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    const { name, phone, address } = req.body;
    const users = readData(USERS_FILE, []);
    const userIndex = users.findIndex(u => u.id === decoded.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (name) users[userIndex].name = name.trim();
    if (phone) users[userIndex].phone = phone.trim();
    if (address) users[userIndex].address = address;

    writeData(USERS_FILE, users);

    const userPayload = { ...users[userIndex] };
    delete userPayload.password;

    res.json({
      message: 'Profile updated successfully!',
      user: userPayload
    });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// GET CURRENT USER
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const users = readData(USERS_FILE, []);
    const user = users.find(u => u.id === decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const userPayload = { ...user };
    delete userPayload.password;
    res.json({ user: userPayload });
  } catch (e) {
    res.status(401).json({ error: 'Session expired or invalid.' });
  }
});

// GET MAIL INBOX (For simulator preview in UI)
router.get('/mail-inbox', (req, res) => {
  const inbox = readData(MAIL_FILE, []);
  res.json({ inbox });
});

module.exports = router;
