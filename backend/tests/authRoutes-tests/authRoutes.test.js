const supertest = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

beforeAll(async () => {
  // Connect to Mongo testing database
  await mongoose.connect(process.env.URL_MONGO_DB_TEST);

  // Clear the 'users' collection before running the tests
  await mongoose.connection.collection('users').deleteMany();
});

describe("authRoutes", () => {


  describe("get route auth/signup", () => {

    describe("given password doesn't match required string type", () => {
      it("should return a 400 'Bad Request", async () => {
        // Create a user for strong password testing
        const user = { email: 'john.doe@outlook.com', password: '1234' };
        await supertest(app).post('/api/auth/signup').send(user).expect(400);
      })
    });

    describe("given password match required string type", () => {
      it("should return a 200, 'Created", async () => {
        // Create a user for strong password testing
        const user = { email: 'john.doe@outlook.com', password: 'Cc123456789ù%' };
        await supertest(app).post('/api/auth/signup').send(user).expect(201);
      })
    })
  });

  let userId;

  describe("get route auth/login", () => {

    describe("given the user does not exist", () => {
      it("should return a 401 'Unauthorized' ", async () => {
        // Create unregistered user
        const user = { email: 'jane.doe@outlook.com', password: 'Cc123456789ù%' };
        await supertest(app).post(`/api/auth/login`).send(user).expect(401);
      })
    });

    describe("given the user does exist", () => {
      it("should return a 200", async () => {
        // create registered user
        const user = { email: 'john.doe@outlook.com', password: 'Cc123456789ù%' };
        const response = await supertest(app).post(`/api/auth/login`).send(user).expect(200);
        userId = response.body.userId;
      });
    });
  });

  describe("get route auth/deleteUser", () => {
    
    describe("given the user exist", () => {
      it("should return a 200", async () => {
        await supertest(app).delete(`/api/auth/delete/${userId}`).expect(200);
      })
    });
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});