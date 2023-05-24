'use strict'

const authenticationService = require('../services/authentications');
require('express-async-errors');
require('dotenv').config();


/**

Logs in a user.
@param {Object} req - The request object.
@param {Object} res - The response object.
*/

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authenticationService.loginUser(email, password);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: error.message });
  }
};


/**

Signs up a new user.
@param {Object} req - The request object.
@param {Object} res - The response object.
*/

const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authenticationService.createUser(email, password);
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};


/**

Deletes a user.
@param {Object} req - The request object.
@param {Object} res - The response object.
*/

const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await authenticationService.deleteUser(userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(404).json({ error: error.message });
  }
};

module.exports = {
  loginUser,
  signupUser,
  deleteUser,
};

// Next route --> ../routes/authentications