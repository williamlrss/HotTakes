// const request = require('supertest');
// const express = require('express');
// const authService = require('../../../services/auth');
// const { signupUserController, loginUserController } = require('../../../controllers/auth');

// jest.mock('../../../services/auth');

// const app = express();
// app.use(express.json());

// // Simulate auth routes
// app.post('/signup', signupUserController);
// app.post('/login', loginUserController);

// const email = 'auth.controller@test.com';
// const password = 'password';
// const user = { email: email, password: password };
// const mockUser = { id: 1, email, password, token: 'abc123' };

// // Routes helpers
// const createUser = async (user) => {
// 	return await request(app).post('/signup').send(user);
// };
// const loginUser = async (user) => {
// 	return await request(app).post('/login').send(user);
// };

// beforeEach(() => {
// 	global.console = {
// 		log: jest.fn(),
// 		info: jest.fn(),
// 		error: jest.fn(),
// 		warn: jest.fn(),
// 	};

// 	jest.clearAllMocks(); // Clear all mocks before each test
// });

// describe('POST /signup', () => {
// 	it('should create a user and return 201 status on success', async () => {
// 		// Mock successful createUser call
// 		authService.createUser.mockResolvedValue(mockUser);

// 		const res = await createUser(user);

// 		expect(res.status).toBe(201);
// 		expect(res.body).toEqual(mockUser);
// 		expect(authService.createUser).toHaveBeenCalledWith(email, password);
// 	});

// 	it('should return 400 status on authService error', async () => {
// 		const mockError = new Error('Something went wrong');

// 		// Mock failed createUser call
// 		authService.createUser.mockRejectedValue(mockError);

// 		const res = await createUser(user);

// 		expect(res.status).toBe(400);
// 		expect(res.body).toEqual({ error: mockError.message });
// 		expect(authService.createUser).toHaveBeenCalledWith(email, password);
// 	});
// });

// describe('POST /login', () => {
// 	it('should login a user and return 200 status on success', async () => {
// 		// Mock successful loginUser call
// 		authService.loginUser.mockResolvedValue(mockUser);

// 		const res = await loginUser(user);

// 		expect(res.status).toBe(200);
// 		expect(res.body).toEqual(mockUser);
// 		expect(authService.loginUser).toHaveBeenCalledWith(email, password);
// 	});

// 	it('should return 401 status on authService error', async () => {
// 		const mockError = new Error('Invalid credentials');

// 		// Mock failed loginUser call
// 		authService.loginUser.mockRejectedValue(mockError);

// 		const res = await loginUser(user);

// 		expect(res.status).toBe(401);
// 		expect(res.body).toEqual({ error: mockError.message });
// 		expect(authService.loginUser).toHaveBeenCalledWith(email, password);
// 	});
// });
