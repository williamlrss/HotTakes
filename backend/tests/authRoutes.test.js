const supertest = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

beforeAll(async () => {
  // Connect to Mongo testing database
  await mongoose.connect(process.env.URL_MONGO_DB_TEST);

  // Clear the 'users' collection before running the tests
  await mongoose.connection.collection('users').deleteMany();

  // Create a user for testing
  const user = { email: 'john.doe@outlook.com', password: 'Cc123456789ù%' };
  await supertest(app).post('/api/auth/signup').send(user);
});

describe("user", () => {
  describe("get user login route", () => {
    describe("given the user does not exist", () => {
      it("should return a 401 'Unauthorized' ", async () => {
        // Create unregistered user
        const user = { email: 'jane.doe@outlook.com', password: 'Cc123456789ù%' };
        await supertest(app).post(`/api/auth/login`).send(user).expect(401);
      })
    })
  })
})

describe("user", () => {
  describe("get user login route", () => {
    describe("given the user does exist", () => {
      it("should return a 200", async () => {
        // create registered user
        const user = { email: 'john.doe@outlook.com', password: 'Cc123456789ù%' };
        await supertest(app).post(`/api/auth/login`).send(user).expect(200);
      });
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});