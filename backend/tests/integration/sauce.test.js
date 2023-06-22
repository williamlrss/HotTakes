// const supertest = require('supertest');
// const app = require('../../app');
// const logger = require('../../utils/winston');
// const mongoose = require('mongoose');
// const path = require('path');
// const dotenv = require('dotenv');
// const fs = require('fs');
// const { expect } = require('chai');
// const { log } = require('console');
// dotenv.config();

// let validToken;
// let userId;
// let invalidToken;
// let wrongUserId;

// // Routes helpers
// const getAllSauces = async () => {
// 	return await supertest(app)
// 		.get('/api/sauces/')
// 		.set('Content-Type', 'application/json')
// 		.set('Authorization', `Bearer ${validToken}`);
// };
// const getOneSauce = async (id) => {
// 	return await supertest(app)
// 		.get(`/api/sauces/${id}`)
// 		.set('Content-Type', 'application/json')
// 		.set('Authorization', `Bearer ${validToken}`);
// };
// const createSauce = async (sauceData, imagePath) => {
// 	const req = supertest(app)
// 		.post('/api/sauces')
// 		.set('Content-Type', 'multipart/form-data')
// 		.set('Authorization', `Bearer ${validToken}`);

// 	req.field('sauce', JSON.stringify(sauceData));

// 	req.attach('image', fs.createReadStream(path.resolve(imagePath)), path.basename(imagePath));
// 	return await req;
// };
// const updateSauce = async (id, updatedSauceData, imagePath) => {
// 	const req = supertest(app)
// 		.put(`/api/sauces/${id}`)
// 		.set('Content-Type', 'multipart/form-data')
// 		.set('Authorization', `Bearer ${validToken}`);

// 	req.field('sauce', JSON.stringify(updatedSauceData));
// 	if (imagePath) {
// 		req.attach('image', fs.createReadStream(path.resolve(imagePath)), path.basename(imagePath));
// 	}
// 	return await req;
// };
// const updateSauceWrongUser = async (id, updatedSauceData, imagePath) => {
// 	const req = supertest(app)
// 		.put(`/api/sauces/${id}`)
// 		.set('Content-Type', 'multipart/form-data')
// 		.set('Authorization', `Bearer ${invalidToken}`);

// 	req.field('sauce', JSON.stringify(updatedSauceData));
// 	if (imagePath) {
// 		req.attach('image', fs.createReadStream(path.resolve(imagePath)), path.basename(imagePath));
// 	}
// 	return await req;
// };
// const deleteSauce = async (id) => {
// 	return await supertest(app)
// 		.delete(`/api/sauces/${id}`)
// 		.set('Content-Type', 'multipart/form-data')
// 		.set('Authorization', `Bearer ${validToken}`);
// };
// const deleteSauceWrongUser = async (id) => {
// 	return await supertest(app)
// 		.delete(`/api/sauces/${id}`)
// 		.set('Content-Type', 'multipart/form-data')
// 		.set('Authorization', `Bearer ${invalidToken}`);
// };
// const likeSauce = async (id, like) => {
// 	return await supertest(app)
// 		.post(`/api/sauces/${id}/like`)
// 		.set('Content-Type', 'application/json')
// 		.set('Authorization', `Bearer ${validToken}`)
// 		.send({ userId, like });
// };

// let sauceIdGetOne;
// let sauceIdUpdateOne;
// let sauceIdDeleteOne;
// let sauceIdCreateOne;

// beforeAll(async () => {
// 	// Connect to Mongo testing database
// 	await mongoose.connect(process.env.URL_MONGO_DB_TEST);

// 	// Clear the 'users' and 'sauce' collection before running tests
// 	await mongoose.connection.collection('sauces').deleteMany();
// 	await mongoose.connection.collection('users').deleteMany();

// 	// Register user
// 	const user = { email: 'sauce.integration@test.com', password: 'validPassword123$' };
// 	await supertest(app).post('/api/auth/signup').send(user);
// 	res = await supertest(app).post('/api/auth/login').send(user);

// 	// Extract Token and userId from response
// 	validToken = res.body.token;
// 	userId = res.body.userId;

// 	const wrongUser = { email: 'sauce.integration2@test.com', password: 'validPassword123$' };
// 	await supertest(app).post('/api/auth/signup').send(wrongUser);
// 	const resWrongUser = await supertest(app).post('/api/auth/login').send(wrongUser);

// 	// Extract Token and userId from response
// 	invalidToken = resWrongUser.body.token;
// 	wrongUserId = resWrongUser.body.userId;

// 	const sauceDataGetone = {
// 		userId: userId,
// 		name: 'getOne',
// 		manufacturer: 'beforeAll',
// 		description: 'Integration Test Sauce',
// 		mainPepper: 'pepper',
// 		heat: 1,
// 	};
// 	const imagePathGetOne = path.join(__dirname, '../../tests/test.png');
// 	await createSauce(sauceDataGetone, imagePathGetOne);

// 	const sauceDataUpdateOne = {
// 		userId: userId,
// 		name: 'updateOne',
// 		manufacturer: 'beforeAll',
// 		description: 'Integration Test Sauce',
// 		mainPepper: 'pepper',
// 		heat: 1,
// 	};
// 	const imagePathUpdateOne = path.join(__dirname, '../../tests/test.png');
// 	await createSauce(sauceDataUpdateOne, imagePathUpdateOne);

// 	const sauceDataDeleteOne = {
// 		userId: userId,
// 		name: 'deleteOne',
// 		manufacturer: 'beforeAll',
// 		description: 'Integration Test Sauce',
// 		mainPepper: 'pepper',
// 		heat: 1,
// 	};
// 	const imagePathDeleteOne = path.join(__dirname, '../../tests/test.png');
// 	await createSauce(sauceDataDeleteOne, imagePathDeleteOne);
// });

// describe('Sauces routes', () => {
// 	describe('GET api/sauces/', () => {
// 		it('should return 200 OK', async () => {
// 			const response = await getAllSauces();
// 			expect(response.status).to.equal(200);
// 			expect(response.body).to.be.an('array');
// 			response.body.forEach((item) => {
// 				expect(item).to.be.an('object');
// 			});

// 			response.body.forEach((sauce) => {
// 				if (sauce.name === 'getOne') {
// 					sauceIdGetOne = sauce._id;
// 				} else if (sauce.name === 'updateOne') {
// 					sauceIdUpdateOne = sauce._id;
// 				} else if (sauce.name === 'deleteOne') {
// 					sauceIdDeleteOne = sauce._id;
// 				}
// 			});
// 		});
// 	});

// 	describe('GET /api/sauces/:id', () => {
// 		it('should return 404', async () => {
// 			const response = await getOneSauce('nonExistenId');
// 			expect(response.status).to.equal(404);
// 			expect(response.body.error).to.equal('Sauce not found');
// 		});

// 		it('should return 400', async () => {
// 			const response = await getOneSauce([400]);
// 			expect(response.status).to.equal(400);
// 			expect(response.body.error).to.equal('Invalid ID format');
// 		});

// 		it('should return 200 OK', async () => {
// 			const response = await getOneSauce(sauceIdGetOne);
// 			expect(response.status).to.equal(200);
// 		});
// 	});

// 	describe('POST /api/sauces/', () => {
// 		it('should return 400 if sauceData is incomplete', async () => {
// 			const sauceData = {
// 				userId: userId,
// 				name: 'Integration Test Sauce',
// 				manufacturer: 'Sauces route',
// 			};
// 			const imagePath = path.join(__dirname, '../../tests/test.png');
// 			const response = await createSauce(sauceData, imagePath);
// 			expect(response.status).to.equal(400);
// 			expect(response.body.error).to.match(/^Sauce validation failed/); // mongoose.error.ValidationError
// 		});

// 		it('should return 401 if userId is missing', async () => {
// 			const sauceData = {
// 				name: 'Integration Test Sauce',
// 				manufacturer: 'Sauces route',
// 				description: 'Create a new sauce',
// 				mainPepper: 'pepper',
// 				heat: 1,
// 			};
// 			const imagePath = path.join(__dirname, '../../tests/test.png');
// 			const response = await createSauce(sauceData, imagePath);

// 			expect(response.status).to.equal(401);
// 			expect(response.body.error).to.equal('User ID is required');
// 		});

// 		// Create a new sauce without an image is impossible in this test suite ('aborted') & already tested in unit tests

// 		it('should return 201', async () => {
// 			const sauceData = {
// 				userId: userId,
// 				name: 'Integration Test Sauce',
// 				manufacturer: 'Sauces route',
// 				description: 'Create a new sauce',
// 				mainPepper: 'pepper',
// 				heat: 1,
// 			};
// 			const imagePath = path.join(__dirname, '../../tests/test.png');
// 			const response = await createSauce(sauceData, imagePath);
// 			sauceIdCreateOne = response.body._id;

// 			expect(response.status).to.equal(201);
// 			expect(response.body).to.have.property('_id');
// 		});
// 	});

// 	describe('PUT /api/sauces/:id', () => {
// 		it('should return 400 when invalid ID format', async () => {
// 			const sauceData = {
// 				userId: userId,
// 				name: 'Integration Test Sauce',
// 				manufacturer: 'Sauces route',
// 				description: 'Update a sauce',
// 				mainPepper: 'pepper',
// 				heat: 1,
// 			};

// 			const response = await updateSauce([400], sauceData);
// 			expect(response.status).to.equal(400);
// 			expect(response.body.error).to.equal('Invalid ID format');
// 		});

// 		it('should return 403 when wrong user', async () => {
// 			const sauceData = {
// 				userId: wrongUserId,
// 				name: 'Integration Test Sauce',
// 				manufacturer: 'Sauces route',
// 				description: 'Update a sauce',
// 				mainPepper: 'pepper',
// 				heat: 1,
// 			};

// 			const response = await updateSauceWrongUser(sauceIdUpdateOne, sauceData);
// 			expect(response.status).to.equal(403);
// 			expect(response.body.error).to.equal('Wrong user for this sauce');
// 		});

// 		it('should return 404 when wrong sauceId', async () => {
// 			const sauceData = {
// 				userId: userId,
// 				name: 'Integration Test Sauce',
// 				manufacturer: 'Sauces route',
// 				description: 'Update a sauce',
// 				mainPepper: 'pepper',
// 				heat: 1,
// 			};

// 			const response = await updateSauce('wrongSauceId', sauceData);
// 			expect(response.status).to.equal(404);
// 			expect(response.body.message).to.equal('Sauce not found');
// 		});

// 		it('should return 201 when updated without image', async () => {
// 			const sauceData = {
// 				userId: userId,
// 				name: 'Integration Test Sauce',
// 				manufacturer: 'Sauces route',
// 				description: 'Update a sauce',
// 				mainPepper: 'pepper',
// 				heat: 1,
// 			};

// 			const response = await updateSauce(sauceIdUpdateOne, sauceData);
// 			expect(response.status).to.equal(200);
// 		});

// 		it('should return 201 when updated with image', async () => {
// 			const sauceData = {
// 				userId: userId,
// 				name: 'Integration Test Sauce',
// 				manufacturer: 'Sauces route',
// 				description: 'Update again',
// 				mainPepper: 'pepper',
// 				heat: 1,
// 			};

// 			const imagePath = path.join(__dirname, '../../tests/test2.png');
// 			const response = await updateSauce(sauceIdUpdateOne, sauceData, imagePath);
// 			expect(response.status).to.equal(200);
// 		});
// 	});

// 	describe('Delete /api/sauces/:id', () => {
// 		it('should return 400 when invalid id format', async () => {
// 			const response = await deleteSauce([400]);
// 			expect(response.status).to.equal(400);
// 			expect(response.body.error).to.equal('Invalid ID format');
// 		});
// 		it('should return 403 when wrong user', async () => {
// 			const response = await deleteSauceWrongUser(sauceIdDeleteOne);
// 			expect(response.status).to.equal(403);
// 			expect(response.body.error).to.equal('Wrong user for this sauce');
// 		});
// 		it('should return 404 when sauce not found', async () => {
// 			const response = await deleteSauce('wrongSauceId');
// 			expect(response.status).to.equal(404);
// 			expect(response.body.error).to.equal('Sauce not found');
// 		});
// 		it('should return 200 OK', async () => {
// 			const response = await deleteSauce(sauceIdDeleteOne);
// 			expect(response.status).to.equal(200);
// 		});
// 	});

// 	describe('POST /api/sauces/:id/like', () => {
// 		it('should return 400 when invalid id format', async () => {
// 			const response = await likeSauce([400], 1, userId);
// 			expect(response.status).to.equal(400);
// 			expect(response.body.error).to.equal('Invalid ID format');
// 		});
// 		it('should return 400 when invalid like value', async () => {
// 			const response = await likeSauce(sauceIdGetOne, 'InvalidLikeValue', userId);
// 			expect(response.status).to.equal(400);
// 			expect(response.body.error).to.equal('Invalid like value');
// 		});
// 		it('should return 404 when sauce not found', async () => {
// 			const response = await likeSauce('wrongSauceId', 1, userId);
// 			expect(response.status).to.equal(404);
// 			expect(response.body.error).to.equal('Sauce not found');
// 		});
// 		it('should return 200 OK when a user like a sauce', async () => {
// 			const likeValue = 1;
// 			const sauce = await likeSauce(sauceIdGetOne, likeValue, userId);
// 			expect(sauce.status).to.equal(200);
// 			expect(sauce.body.message).to.equal('Like/dislike updated!');
// 			const response = await getOneSauce(sauceIdGetOne);
// 			expect(response.body.likes).to.equal(1);
// 			expect(response.body.usersLiked).to.deep.equal([userId]);
// 			expect(response.body.dislikes).to.equal(0);
// 			expect(response.body.usersDisliked).to.deep.equal([]);
// 		});
// 		it('should return 200 OK when a user unlike a sauce', async () => {
// 			const likeValue = 0;
// 			const sauce = await likeSauce(sauceIdGetOne, likeValue, userId);
// 			expect(sauce.status).to.equal(200);
// 			expect(sauce.body.message).to.equal('Like/dislike updated!');
// 			const response = await getOneSauce(sauceIdGetOne);
// 			expect(response.body.likes).to.equal(0);
// 			expect(response.body.usersLiked).to.deep.equal([]);
// 			expect(response.body.dislikes).to.equal(0);
// 			expect(response.body.usersDisliked).to.deep.equal([]);
// 		});
// 		it('should return 200 OK when a user dislike a sauce', async () => {
// 			const likeValue = -1;
// 			const sauce = await likeSauce(sauceIdGetOne, likeValue, userId);
// 			expect(sauce.status).to.equal(200);
// 			expect(sauce.body.message).to.equal('Like/dislike updated!');
// 			const response = await getOneSauce(sauceIdGetOne);
// 			expect(response.body.likes).to.equal(0);
// 			expect(response.body.usersLiked).to.deep.equal([]);
// 			expect(response.body.dislikes).to.equal(1);
// 			expect(response.body.usersDisliked).to.deep.equal([userId]);
// 		});
// 		it('should return 200 OK when a user undislike a sauce', async () => {
// 			const likeValue = 0;
// 			const sauce = await likeSauce(sauceIdGetOne, likeValue, userId);
// 			expect(sauce.status).to.equal(200);
// 			expect(sauce.body.message).to.equal('Like/dislike updated!');
// 			const response = await getOneSauce(sauceIdGetOne);
// 			expect(response.body.likes).to.equal(0);
// 			expect(response.body.usersLiked).to.deep.equal([]);
// 			expect(response.body.dislikes).to.equal(0);
// 			expect(response.body.usersDisliked).to.deep.equal([]);
// 		});
// 	});
// });

// afterAll(async () => {
// 	await deleteSauce(sauceIdGetOne);
// 	await deleteSauce(sauceIdUpdateOne);
// 	await deleteSauce(sauceIdCreateOne);

// 	fs.readdir('./images', (err, files) => {
// 		if (err) {
// 			console.error(`Error reading directory: ${err}`);
// 		} else {
// 			files.forEach((file) => {
// 				if (file.includes('test')) {
// 					fs.unlink(path.join('./images', file), (err) => {
// 						if (err) {
// 							console.error(`Error deleting file: ${err}`);
// 						} else {
// 						}
// 					});
// 				}
// 			});
// 		}
// 	});

// 	await mongoose.connection.collection('sauces').deleteMany();
// 	await mongoose.connection.collection('users').deleteMany();
// 	await mongoose.connection.close();
// });
