const request = require('supertest');
const express = require('express');
const path = require('path');
const app = require('./your-express-app-file'); // Replace with the path to your Express app file

describe('Express App', () => {
  it('should respond with a 200 status code for GET requests to /', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
  });

  it('should respond with a 404 status code for GET requests to a non-existent route', async () => {
    const response = await request(app).get('/non-existent-route');
    expect(response.statusCode).toBe(404);
  });

  // Add more test cases to cover other routes and functionality
});

const request = require('supertest');



const app = express();
app.use('/images', express.static(path.join(__dirname, 'images')));

describe('Static Files', () => {
  it('should respond with a 200 status code and serve the image file', async () => {
    const response = await request(app).get('/images/example.jpg');
    expect(response.statusCode).toBe(200);
    expect(response.headers['content-type']).toContain('image/jpeg');
  });

  it('should respond with a 404 status code for a non-existent image file', async () => {
    const response = await request(app).get('/images/non-existent.jpg');
    expect(response.statusCode).toBe(404);
  });

  // Add more test cases for other scenarios if needed
});
