'use strict';

const User = require('../models/authentications');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../winston');
require('express-async-errors');
require('dotenv').config();

/**
 * Logs in a user with the provided email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object} An object containing the user ID and authentication token.
 * @throws {Error} If the email or password is invalid.
 */
const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });

  return { userId: user._id, token };
};

/**
 * Signs up a new user with the provided email and password.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Object} An object containing a success message.
 * @throws {Error} If the email already exists.
 */
const createUser = async (email, password) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  return { message: 'User registration successful' };
};

/**
 * Deletes a user with the specified user ID.
 * @param {string} userId - The ID of the user to delete.
 * @returns {Object} An object containing a success message.
 * @throws {Error} If the user is not found.
 */
const deleteUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  await User.findByIdAndDelete(userId);

  return { message: 'User deleted successfully' };
};

module.exports = {
  loginUser,
  createUser,
  deleteUser,
};