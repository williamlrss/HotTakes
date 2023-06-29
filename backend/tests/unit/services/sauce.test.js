const supertest = require('supertest');
const app = require('../../../app');
const sauceService = require('../../../services/sauce');
const Sauce = require('../../../models/sauce');

jest.mock('../../../middleware/authenticate', () => (req, res, next) => next());
jest.mock('../../../models/sauce');

describe('sauceService additionals unit tests', () => {
	describe('getAllSauces method', () => {
		test('It should respond with 500 on error', async () => {
			sauceService.getAllSauces = jest.fn().mockImplementation(() => {
				throw new Error('Failed to get sauces');
			});

			const response = await supertest(app)
				.get('/api/sauces/')
				.set('Content-Type', 'application/json');

			console.log(response.statusCode, response.body.error);
			expect(response.statusCode).toBe(500);
			expect(response.body.error).toEqual('Server error, please try again later');
		});
	});

	describe('createSauce method', () => {
		test('should throw an error if no image URL is provided', async () => {
			const sauceData = { userId: 'test-user-id', name: 'test-sauce' };

			await expect(sauceService.createSauce(sauceData)).rejects.toThrow(
				'Image file is required'
			);
		});
	});

	describe('deleteSauce method', () => {
		test('It should throw an error with invalid ID format', async () => {
			// Create a fake id
			const invalidId = '1';

			// Mock the findById and deleteOne methods of the Sauce model
			Sauce.findById = jest.fn();
			Sauce.deleteOne = jest.fn();

			// Call the deleteSauce function with the fake id
			await expect(sauceService.deleteSauce(invalidId)).rejects.toThrow('Invalid ID format');
		});
	});

	describe('likeSauce method', () => {
		test('It should throw an error with invalid ID format', async () => {
			// Create a fake id
			const invalidId = '1';

			// Mock the findById method of the Sauce model to return a promise that resolves to a sauce object
			Sauce.findById = jest.fn().mockResolvedValue({
				usersLiked: ['someUserId'],
				usersDisliked: ['anotherUserId'],
				likes: 1,
				dislikes: 1,
			});

			// Call the likeSauce function with the fake id
			await expect(sauceService.likeSauce(invalidId, 1, 'dummyUserId')).rejects.toThrow(
				'Invalid ID format'
			);
		});
	});
});

afterAll(() => {
	jest.resetAllMocks();
});
