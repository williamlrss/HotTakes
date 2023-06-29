const supertest = require('supertest');
const app = require('../../app');
const Sauce = require('../../models/sauce');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const { expect } = require('chai');
const dotenv = require('dotenv');
dotenv.config();

let validToken;
let userId;
let wrongUserToken;
let wrongUserId;

// Routes helpers
const getAllSauces = async () => {
	return await supertest(app)
		.get('/api/sauces/')
		.set('Content-Type', 'application/json')
		.set('Authorization', `Bearer ${validToken}`);
};

const getOneSauce = async (id) => {
	return await supertest(app)
		.get(`/api/sauces/${id}`)
		.set('Content-Type', 'application/json')
		.set('Authorization', `Bearer ${validToken}`);
};

const createSauce = async (sauceData, imagePath) => {
	const req = supertest(app)
		.post('/api/sauces')
		.set('Content-Type', 'multipart/form-data')
		.set('Authorization', `Bearer ${validToken}`);

	req.field('sauce', JSON.stringify(sauceData));

	req.attach('image', fs.createReadStream(path.resolve(imagePath)), path.basename(imagePath));
	return await req;
};

const updateSauce = async (id, updatedSauceData, imagePath) => {
	const req = supertest(app)
		.put(`/api/sauces/${id}`)
		.set('Content-Type', 'multipart/form-data')
		.set('Authorization', `Bearer ${validToken}`);

	req.field('sauce', JSON.stringify(updatedSauceData));
	if (imagePath) {
		req.attach('image', fs.createReadStream(path.resolve(imagePath)), path.basename(imagePath));
	}
	return await req;
};

const updateSauceWrongUser = async (id, updatedSauceData, imagePath) => {
	const req = supertest(app)
		.put(`/api/sauces/${id}`)
		.set('Content-Type', 'multipart/form-data')
		.set('Authorization', `Bearer ${wrongUserToken}`);

	req.field('sauce', JSON.stringify(updatedSauceData));
	if (imagePath) {
		req.attach('image', fs.createReadStream(path.resolve(imagePath)), path.basename(imagePath));
	}
	return await req;
};

const deleteSauce = async (id) => {
	return await supertest(app)
		.delete(`/api/sauces/${id}`)
		.set('Content-Type', 'multipart/form-data')
		.set('Authorization', `Bearer ${validToken}`);
};

const deleteSauceWrongUser = async (id) => {
	return await supertest(app)
		.delete(`/api/sauces/${id}`)
		.set('Content-Type', 'multipart/form-data')
		.set('Authorization', `Bearer ${wrongUserToken}`);
};

const likeSauce = async (id, like, userId) => {
	return await supertest(app)
		.post(`/api/sauces/${id}/like`)
		.set('Content-Type', 'application/json')
		.set('Authorization', `Bearer ${validToken}`)
		.send({ like, userId });
};

beforeAll(async () => {
	// Connect to Mongo testing database
	await mongoose.connect(process.env.URL_MONGO_DB_SAUCES_INT_TEST);

	// Clear the 'users' and 'sauce' collection before running tests
	await mongoose.connection.collection('sauces').deleteMany();
	await mongoose.connection.collection('users').deleteMany();

	// Register user
	const user = { email: 'user.sauceIntegration@test.com', password: 'strongPassword123$' };
	await supertest(app).post('/api/auth/signup').send(user);
	const res = await supertest(app).post('/api/auth/login').send(user);

	// Extract Token and userId from response
	validToken = res.body.token;
	userId = res.body.userId;

	// Resister wrong user
	const wrongUser = {
		email: 'wrongUser.sauceIntegration@test.com',
		password: 'strongPassword123$',
	};
	await supertest(app).post('/api/auth/signup').send(wrongUser);
	const resWrongUser = await supertest(app).post('/api/auth/login').send(wrongUser);

	// Extract Token and userId from response
	wrongUserToken = resWrongUser.body.token;
	wrongUserId = resWrongUser.body.userId;
});

let sauceId;
const wrongSauceId = '507f1f77bcf86cd799439011';

beforeEach(async () => {
	// Create a test sauce
	const sauceDataForTests = {
		userId: userId,
		name: 'Integration Test Sauce',
		manufacturer: 'beforeEach',
		description: 'test',
		mainPepper: 'test',
		heat: 1,
	};

	// Use real image for testing
	const imagePathForTests = path.join(__dirname, '../../tests/test.png');
	const sauce = await createSauce(sauceDataForTests, imagePathForTests);

	sauceId = sauce.body._id;
});

afterEach(async () => {
	// Clear the 'users' and 'sauce' collection after each test
	await mongoose.connection.collection('sauces').deleteMany();

	// Clear images folder from test files
	fs.readdir('./images', (err, files) => {
		if (err) {
			console.error(`Error reading directory: ${err}`);
		} else {
			files.forEach((file) => {
				if (file.includes('test')) {
					fs.unlink(path.join('./images', file), (err) => {
						if (err) {
							console.error(`Error deleting file: ${err}`);
						} else {
						}
					});
				}
			});
		}
	});
});

describe('Sauces routes', () => {
	describe('GET api/sauces/', () => {
		it('should return 200 OK', async () => {
			const response = await getAllSauces();
			expect(response.status).to.equal(200);
			expect(response.body).to.be.an('array');
			response.body.forEach((item) => {
				expect(item).to.be.an('object');
			});
		});
	});

	describe('GET /api/sauces/:id', () => {
		it('should return 404', async () => {
			const response = await getOneSauce(wrongSauceId);
			expect(response.status).to.equal(404);
			expect(response.body.error).to.equal('Sauce not found');
		});

		it('should return 400', async () => {
			const response = await getOneSauce('invalidId');
			expect(response.body.error).to.equal('Sauce not found');
			expect(response.status).to.equal(404);
		});

		it('should return 200 OK', async () => {
			const response = await getOneSauce(sauceId);
			expect(response.status).to.equal(200);
		});
	});

	describe('POST /api/sauces/', () => {
		it('should return 400 if sauceData is incomplete', async () => {
			const sauceData = {
				userId: userId,
				name: 'Integration Test Sauce',
				manufacturer: 'Sauces route',
			};
			const imagePath = path.join(__dirname, '../../tests/test.png');
			const response = await createSauce(sauceData, imagePath);
			expect(response.status).to.equal(422);
			expect(response.body.error).to.equal('Invalid provided ressources'); // mongoose.error.ValidationError
		});

		it('should return 401 if userId is missing', async () => {
			const sauceData = {
				name: 'Integration Test Sauce',
				manufacturer: 'Sauces route',
				description: 'Create a new sauce',
				mainPepper: 'pepper',
				heat: 1,
			};
			const imagePath = path.join(__dirname, '../../tests/test.png');
			const response = await createSauce(sauceData, imagePath);

			expect(response.status).to.equal(401);
			expect(response.body.error).to.equal('Authentication failed');
		});

		// Create a new sauce without an image is impossible in this test suite ('aborted') & already tested in unit tests

		it('should return 201', async () => {
			const sauceData = {
				userId: userId,
				name: 'Integration Test Sauce',
				manufacturer: 'Sauces route',
				description: 'Create a new sauce',
				mainPepper: 'pepper',
				heat: 1,
			};
			const imagePath = path.join(__dirname, '../../tests/test.png');
			const response = await createSauce(sauceData, imagePath);
			sauceIdCreateOne = response.body._id;

			expect(response.status).to.equal(201);
			expect(response.body).to.have.property('_id');
		});
	});

	describe('PUT /api/sauces/:id', () => {
		it('should return 404 when invalid ID format', async () => {
			const sauceData = {
				userId: userId,
				name: 'Integration Test Sauce',
				manufacturer: 'Sauces route',
				description: 'Update a sauce',
				mainPepper: 'pepper',
				heat: 1,
			};
			const response = await updateSauce('invalidSauceId', sauceData);
			expect(response.status).to.equal(404);
			expect(response.body.error).to.equal('Sauce not found');
		});

		it('should return 404 when wrong sauceId', async () => {
			const sauceData = {
				userId: userId,
				name: 'Integration Test Sauce',
				manufacturer: 'Sauces route',
				description: 'Update a sauce',
				mainPepper: 'pepper',
				heat: 1,
			};
			const response = await updateSauce(wrongSauceId, sauceData);
			expect(response.status).to.equal(404);
			expect(response.body.error).to.equal('Sauce not found');
		});

		it('should return 403 when wrong user', async () => {
			const sauceDataUpdateOne = {
				userId: wrongUserId,
				name: 'Integration Test Sauce',
				manufacturer: 'Sauces route',
				description: 'Update a sauce',
				mainPepper: 'pepper',
				heat: 1,
			};
			const response = await updateSauceWrongUser(sauceId, sauceDataUpdateOne);

			expect(response.status).to.equal(403);
			expect(response.body.error).to.equal('Wrong user for this sauce');
		});

		it('should return 201 when updated without image', async () => {
			const sauceData = {
				userId: userId,
				name: 'Integration Test Sauce',
				manufacturer: 'Sauces route',
				description: 'Update a sauce',
				mainPepper: 'pepper',
				heat: 1,
			};
			const response = await updateSauce(sauceId, sauceData);
			expect(response.status).to.equal(200);
		});

		it('should return 201 when updated with image', async () => {
			const sauceData = {
				userId: userId,
				name: 'Integration Test Sauce',
				manufacturer: 'Sauces route',
				description: 'Update again',
				mainPepper: 'pepper',
				heat: 1,
			};
			const imagePath = path.join(__dirname, '../../tests/test2.png');
			const response = await updateSauce(sauceId, sauceData, imagePath);
			expect(response.status).to.equal(200);
		});
	});

	describe('Delete /api/sauces/:id', () => {
		it('should return 404 when invalid id format', async () => {
			const response = await deleteSauce('invalidId');
			expect(response.status).to.equal(404);
			expect(response.body.error).to.equal('Sauce not found');
		});

		it('should return 404 when sauce not found', async () => {
			const response = await deleteSauce(wrongSauceId);
			expect(response.status).to.equal(404);
			expect(response.body.error).to.equal('Sauce not found');
		});

		it('should return 403 when wrong user', async () => {
			const response = await deleteSauceWrongUser(sauceId);
			expect(response.status).to.equal(403);
			expect(response.body.error).to.equal('Wrong user for this sauce');
		});

		it('should return 200 OK', async () => {
			const response = await deleteSauce(sauceId);
			expect(response.status).to.equal(200);
		});
	});

	describe('POST /api/sauces/:id/like', () => {
		it('should return 404 when invalid id format', async () => {
			const response = await likeSauce('invalidId', 1, userId);
			expect(response.status).to.equal(404);
			expect(response.body.error).to.equal('Sauce not found');
		});

		it('should return 404 when sauce not found', async () => {
			const response = await likeSauce(wrongSauceId, 1, userId);
			expect(response.status).to.equal(404);
			expect(response.body.error).to.equal('Sauce not found');
		});

		it('should return 400 when invalid like value', async () => {
			const response = await likeSauce(sauceId, 'InvalidLikeValue', userId);
			expect(response.status).to.equal(400);
			expect(response.body.error).to.equal('Invalid like value');
		});

		it('should return 200 OK when a user like a sauce', async () => {
			const before = await getOneSauce(sauceId);
			expect(before.body.likes).to.equal(0);
			expect(before.body.usersLiked).to.deep.equal([]);
			expect(before.body.dislikes).to.equal(0);
			expect(before.body.usersDisliked).to.deep.equal([]);

			const likeValue = 1;

			const sauce = await likeSauce(sauceId, likeValue, userId);
			expect(sauce.status).to.equal(200);
			expect(sauce.body.message).to.equal('Like/dislike updated!');

			const after = await getOneSauce(sauceId);
			expect(after.body.likes).to.equal(1);
			expect(after.body.usersLiked).to.deep.equal([userId]);
			expect(after.body.dislikes).to.equal(0);
			expect(after.body.usersDisliked).to.deep.equal([]);
		});

		it('should return 200 OK when a user unlike a sauce', async () => {
			const setSauce = await Sauce.findById(sauceId);
			setSauce.set({
				likes: 1,
				usersLiked: [userId],
				dislikes: 0,
				usersDisliked: [],
			});
			await setSauce.save();

			const before = await getOneSauce(sauceId);
			expect(before.body.likes).to.equal(1);
			expect(before.body.usersLiked).to.deep.equal([userId]);
			expect(before.body.dislikes).to.equal(0);
			expect(before.body.usersDisliked).to.deep.equal([]);

			const likeValue = 0;

			const sauce = await likeSauce(sauceId, likeValue, userId);
			expect(sauce.status).to.equal(200);
			expect(sauce.body.message).to.equal('Like/dislike updated!');

			const after = await getOneSauce(sauceId);
			expect(after.body.likes).to.equal(0);
			expect(after.body.usersLiked).to.deep.equal([]);
			expect(after.body.dislikes).to.equal(0);
			expect(after.body.usersDisliked).to.deep.equal([]);
		});

		it('should return 200 OK when a user dislike a sauce', async () => {
			const before = await getOneSauce(sauceId);
			expect(before.body.likes).to.equal(0);
			expect(before.body.usersLiked).to.deep.equal([]);
			expect(before.body.dislikes).to.equal(0);
			expect(before.body.usersDisliked).to.deep.equal([]);

			const likeValue = -1;

			const sauce = await likeSauce(sauceId, likeValue, userId);
			expect(sauce.status).to.equal(200);
			expect(sauce.body.message).to.equal('Like/dislike updated!');

			const after = await getOneSauce(sauceId);
			expect(after.body.likes).to.equal(0);
			expect(after.body.usersLiked).to.deep.equal([]);
			expect(after.body.dislikes).to.equal(1);
			expect(after.body.usersDisliked).to.deep.equal([userId]);
		});

		it('should return 200 OK when a user undislike a sauce', async () => {
			const setSauce = await Sauce.findById(sauceId);
			setSauce.set({
				likes: 0,
				usersLiked: [],
				dislikes: 1,
				usersDisliked: [userId],
			});
			await setSauce.save();

			const before = await getOneSauce(sauceId);
			expect(before.body.likes).to.equal(0);
			expect(before.body.usersLiked).to.deep.equal([]);
			expect(before.body.dislikes).to.equal(1);
			expect(before.body.usersDisliked).to.deep.equal([userId]);

			const likeValue = 0;

			const sauce = await likeSauce(sauceId, likeValue, userId);
			expect(sauce.status).to.equal(200);
			expect(sauce.body.message).to.equal('Like/dislike updated!');

			const after = await getOneSauce(sauceId);
			expect(after.body.likes).to.equal(0);
			expect(after.body.usersLiked).to.deep.equal([]);
			expect(after.body.dislikes).to.equal(0);
			expect(after.body.usersDisliked).to.deep.equal([]);
		});
	});
});

afterAll(async () => {
	await mongoose.connection.collection('users').deleteMany();
	await mongoose.connection.close();
});
