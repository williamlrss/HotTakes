'use strict'

const crypto = require('crypto');
const dotenv = require('dotenv');
const fs = require('fs');


/**

Generates a new secret key and updates the '.env' file.
@returns {string} The generated secret key.
*/

function generateSecretKey() {
  const secretKey = crypto.randomBytes(32).toString('hex');

  const envConfig = dotenv.parse(fs.readFileSync('.env'));
  envConfig['SECRET_KEY'] = secretKey;
  fs.writeFileSync('.env', Object.entries(envConfig).map(([key, value]) => `${key}=${value}`).join('\n'));

  return secretKey;
}

generateSecretKey();