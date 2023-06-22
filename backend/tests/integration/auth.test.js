// const supertest = require('supertest');
// const app = require('../../app');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// dotenv.config();

// // Routes helpers
// const createUser = async (user) => {
// 	return await supertest(app).post('/api/auth/signup').send(user);
// };
// const loginUser = async (user) => {
// 	return await supertest(app).post('/api/auth/login').send(user);
// };
// const deleteUser = async (userId) => {
// 	return await supertest(app).delete(`/api/auth/delete/${userId}`);
// };

// beforeAll(async () => {
// 	// Connect to Mongo testing database
// 	await mongoose.connect(process.env.URL_MONGO_DB_TEST);

// 	// Clear the 'users' collection before running the tests
// 	await mongoose.connection.collection('users').deleteMany();

// 	// Debug 'username_1' collection before running the tests
// 	await mongoose.connection.collection('users').dropIndex('username_1', function (err, result) {
// 		if (err) {
// 			console.log('Error in dropping index:', err);
// 		}
// 	});
// });

// beforeEach(async () => {
// 	const user = { email: 'auth.integration@test.com', password: 'Cc123456789ù%' };
// 	await createUser(user);
// });

// afterEach(async () => {
// 	await mongoose.connection.collection('users').deleteMany();
// });

// describe('authRoutes', () => {
// 	describe('POST /signup', () => {
// 		it("should return a 400 'Bad Request' when password doesn't meet strength requirements", async () => {
// 			// Create a user with weak password
// 			const user = { email: 'wrongAuth.integration@test.com', password: '1234' };
// 			const response = await createUser(user);
// 			expect(response.status).toBe(400);
// 			expect(response.body.error).toBe(
// 				'The password must contain at least 8 characters, one uppercase letter, and one special character'
// 			);
// 		});

// 		it("should return a 400 'Bad Request' when the email format is invalid", async () => {
// 			// Create a user with invalid email format
// 			const user = { email: 'wrongAuth.integration', password: 'Cc123456789ù%' };
// 			const response = await createUser(user);
// 			expect(response.status).toBe(400);
// 			expect(response.body.error).toBe('Invalid email format');
// 		});

// 		it('should return a 400 when the email already exists', async () => {
// 			// Create a user
// 			const user = { email: 'auth.integration@test.com', password: 'Cc123456789ù%' };
// 			// Try to create the same user again
// 			const response = await createUser(user);
// 			expect(response.status).toBe(400);
// 			expect(response.body.error).toBe('Email already exists');
// 		});

// 		it('should return a 201 when password meets strength requirements', async () => {
// 			// Create a user for strong password testing
// 			const user = { email: 'validAuth.integration@test.com', password: 'Cc123456789ù%' };
// 			const response = await createUser(user);
// 			console.log(response.body);
// 			expect(response.status).toBe(201);
// 			expect(response.body.message).toBe('User registration successful');
// 		});
// 	});

// 	describe('POST /login', () => {
// 		it("should return a 401 'Unauthorized' when the user does not exist", async () => {
// 			// Create unregistered user
// 			const user = { email: 'wrongAuth.integration@test.com', password: 'Cc123456789Ò%' };
// 			const response = await loginUser(user);
// 			expect(response.status).toBe(401);
// 			expect(response.body.error).toBe('Invalid email');
// 		});

// 		it("should return a 401 'Unauthorized' when the password is incorrect", async () => {
// 			const userSignedUp = { email: 'auth.integration@test.com', password: 'Cc123456789ù%' };
// 			await createUser(userSignedUp);

// 			// Create user with wrong password
// 			const user = { email: 'auth.integration@test.com', password: 'wrong_password' };
// 			const response = await loginUser(user);
// 			expect(response.status).toBe(401);
// 			expect(response.body.error).toBe('Invalid password');
// 		});

// 		it('should return a 200 when the user exists', async () => {
// 			const userSignedUp = { email: 'auth.integration@test.com', password: 'Cc123456789ù%' };
// 			await createUser(userSignedUp);

// 			// create registered user
// 			const user = { email: 'auth.integration@test.com', password: 'Cc123456789ù%' };
// 			const response = await loginUser(user);
// 			expect(response.status).toBe(200);
// 			expect(response.body).toHaveProperty('userId');
// 			expect(response.body).toHaveProperty('token');
// 		});
// 	});

// 	describe('DELETE /deleteUser', () => {
// 		it('should return a 200 when the user exists', async () => {
// 			const userSignedUp = { email: 'auth.integration@test.com', password: 'Cc123456789ù%' };
// 			await createUser(userSignedUp);
// 			const userLoginResponse = await loginUser(userSignedUp);
// 			const userId = userLoginResponse.body.userId;
// 			console.log(userId);

// 			const response = await deleteUser(userId);
// 			expect(response.status).toBe(200);
// 			expect(response.body.message).toBe('User deleted successfully');
// 		});

// 		it("should return a 404 when the user doesn't exists", async () => {
// 			const userId = '507f1f77bcf86cd799439011';
// 			const response = await deleteUser(userId);
// 			expect(response.status).toBe(404);
// 			expect(response.body.error).toBe('User not found');
// 		});
// 	});
// });

// afterAll(async () => {
// 	await mongoose.connection.close();
// });
