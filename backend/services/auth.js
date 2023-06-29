'use strict';

const User = require('../models/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const validator = require('validator');

const createUser = async (email, password) => {
	try {
		if (!validator.isEmail(email)) {
			throw new Error('Invalid email format');
		}
		if (!validator.isStrongPassword(password)) {
			throw new Error(
				'The password must contain at least 8 characters, one uppercase letter, and one special character'
			);
		}
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			throw new Error('Email already exists');
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = new User({ email, password: hashedPassword });
		await newUser.save();
		return { message: 'User registration successful' };
	} catch (error) {
		throw error;
	}
};

const loginUser = async (email, password) => {
	try {
		const user = await User.findOne({ email });
		if (!user) {
			throw new Error('Invalid email');
		}
		const isPasswordValid = await bcrypt.compare(password, user.password);
		if (!isPasswordValid) {
			throw new Error('Invalid password');
		}
		const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
			expiresIn: '1h',
		});
		return { userId: user._id, token };
	} catch (error) {
		throw error;
	}
};

const deleteUser = async (userId) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			throw new Error('User not found');
		}
		await User.findByIdAndDelete(userId);
		return { message: 'User deleted successfully' };
	} catch (error) {
		throw error;
	}
};

module.exports = {
	loginUser,
	createUser,
	deleteUser,
}; // Towards authcontroller
