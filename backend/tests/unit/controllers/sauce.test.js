// const chai = require('chai');
// const sinon = require('sinon');
// const expect = chai.expect;

// // Import the services and controllers you'll test
// const sauceService = require('../../../services/sauce');
// const {
// 	getAllSaucesController,
// 	getOneSauceController,
// 	createSauceController,
// 	updateSauceController,
// 	deleteSauceController,
// 	likeSauceController,
// } = require('../../../controllers/sauce');

// describe('sauceController', () => {
// 	let req, res, status, json, next;
// 	beforeEach(() => {
// 		res = {};
// 		status = sinon.stub();
// 		json = sinon.spy();
// 		next = sinon.spy();
// 		res.status = sinon.stub().returns({ json });

// 		// Stub the service methods
// 		sinon.stub(sauceService, 'getAllSauces');
// 		sinon.stub(sauceService, 'getOneSauce');
// 		sinon.stub(sauceService, 'createSauce');
// 		sinon.stub(sauceService, 'updateSauce');
// 		sinon.stub(sauceService, 'deleteSauce');
// 		sinon.stub(sauceService, 'likeSauce');
// 	});

// 	afterEach(() => {
// 		// Restore the service methods
// 		sauceService.getAllSauces.restore();
// 		sauceService.getOneSauce.restore();
// 		sauceService.createSauce.restore();
// 		sauceService.updateSauce.restore();
// 		sauceService.deleteSauce.restore();
// 		sauceService.likeSauce.restore();
// 	});

// 	describe('getAllSaucesController', () => {
// 		beforeEach(() => {
// 			req = {};
// 		});

// 		it('should return all sauces and a 200 status on success', async () => {
// 			// Arrange
// 			const sauces = [{ name: 'BBQ' }, { name: 'Tabasco' }];
// 			sauceService.getAllSauces.resolves(sauces);

// 			// Act
// 			await getAllSaucesController(req, res, next);

// 			// Assert
// 			expect(sauceService.getAllSauces.calledOnce).to.be.true;
// 			expect(res.status.calledWith(200)).to.be.true;
// 			expect(json.calledWith(sauces)).to.be.true;
// 		});

// 		it('should return a 500 status and error message on failure', async () => {
// 			// Arrange
// 			const errorMessage = 'Server error or route misconfiguration';
// 			sauceService.getAllSauces.rejects(new Error(errorMessage));

// 			// Act
// 			await getAllSaucesController(req, res, next);

// 			// Assert
// 			expect(sauceService.getAllSauces.calledOnce).to.be.true;
// 			expect(res.status.calledWith(500)).to.be.true;
// 			expect(json.calledWith({ error: errorMessage })).to.be.true;
// 		});
// 	});

// 	describe('getOneSauceController', () => {
// 		beforeEach(() => {
// 			// Set up request, response objects and the parameter id
// 			req = {
// 				params: {
// 					id: '1',
// 				},
// 			};
// 		});

// 		it('should return the sauce and a 200 status on success', async () => {
// 			// Arrange
// 			const sauce = { name: 'BBQ' };
// 			sauceService.getOneSauce.resolves(sauce);

// 			// Act
// 			await getOneSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.getOneSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(200)).to.be.true;
// 			expect(json.calledWith(sauce)).to.be.true;
// 		});

// 		it('should return a 400 status and error message when sauce is not found', async () => {
// 			// Arrange
// 			sauceService.getOneSauce.resolves(null);

// 			// Act
// 			await getOneSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.getOneSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(404)).to.be.true;
// 			expect(json.calledWith({ error: 'Sauce not found' })).to.be.true;
// 		});

// 		it('should return a 500 status and error message on failure', async () => {
// 			// Arrange
// 			const errorMessage = 'Server error or route misconfiguration';
// 			sauceService.getOneSauce.rejects(new Error(errorMessage));

// 			// Act
// 			await getOneSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.getOneSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(500)).to.be.true;
// 			expect(json.calledWith({ error: errorMessage })).to.be.true;
// 		});
// 	});

// 	describe('createSauceController', () => {
// 		beforeEach(() => {
// 			// Set up request and response objects
// 			req = {
// 				body: {
// 					sauce: JSON.stringify({ name: 'BBQ' }),
// 				},
// 				protocol: 'http',
// 				get: () => 'localhost',
// 				file: {
// 					filename: 'test.jpg',
// 				},
// 			};
// 		});

// 		it('should create a sauce and return a 201 status on success', async () => {
// 			// Arrange
// 			const sauce = { name: 'BBQ' };
// 			sauceService.createSauce.resolves(sauce);

// 			// Act
// 			await createSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.createSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(201)).to.be.true;
// 			expect(json.calledWith(sauce)).to.be.true;
// 		});

// 		it('should return a 400 status and error message on failure', async () => {
// 			// Arrange
// 			const errorMessage = 'Error in creating sauce';
// 			sauceService.createSauce.rejects(new Error(errorMessage));

// 			// Act
// 			await createSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.createSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(400)).to.be.true;
// 			expect(json.calledWith({ error: errorMessage })).to.be.true;
// 		});
// 	});

// 	describe('updateSauceController', () => {
// 		beforeEach(() => {
// 			// Set up request, response objects and the parameter id
// 			req = {
// 				params: {
// 					id: '1',
// 				},
// 				body: {
// 					name: 'BBQ',
// 				},
// 				auth: {
// 					userId: '1',
// 				},
// 				protocol: 'http',
// 				get: () => 'localhost',
// 				file: {
// 					filename: 'test.jpg',
// 				},
// 			};
// 		});

// 		it('should update a sauce and return a 200 status and a success message', async () => {
// 			// Arrange
// 			sauceService.updateSauce.resolves();

// 			// Act
// 			await updateSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.updateSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(200)).to.be.true;
// 			expect(json.calledWith({ message: 'Sauce updated' })).to.be.true;
// 		});

// 		it('should return a 404 status and error message when sauce is not found', async () => {
// 			// Arrange
// 			const errorMessage = 'Sauce not found';
// 			sauceService.updateSauce.rejects(new Error(errorMessage));

// 			// Act
// 			await updateSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.updateSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(404)).to.be.true;
// 			expect(json.calledWith({ error: errorMessage })).to.be.true;
// 		});

// 		it('should return a 403 status and error message when wrong user attempts to update', async () => {
// 			// Arrange
// 			const errorMessage = 'Wrong user for this sauce';
// 			sauceService.updateSauce.rejects(new Error(errorMessage));

// 			// Act
// 			await updateSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.updateSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(403)).to.be.true;
// 			expect(json.calledWith({ message: errorMessage })).to.be.true;
// 		});

// 		it('should return a 500 status and error message on failure', async () => {
// 			// Arrange
// 			const errorMessage = 'Failed to update sauce';
// 			sauceService.updateSauce.rejects(new Error(errorMessage));

// 			// Act
// 			await updateSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.updateSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(500)).to.be.true;
// 			expect(json.calledWith({ error: errorMessage })).to.be.true;
// 		});
// 	});

// 	describe('deleteSauceController', () => {
// 		beforeEach(() => {
// 			// Set up request, response objects and the parameter id
// 			req = {
// 				params: {
// 					id: '1',
// 				},
// 				auth: {
// 					userId: '1',
// 				},
// 			};
// 		});

// 		it('should delete a sauce and return a 200 status and a success message', async () => {
// 			// Arrange
// 			const sauce = { userId: '1' };
// 			sauceService.getOneSauce.resolves(sauce);
// 			sauceService.deleteSauce.resolves();

// 			// Act
// 			await deleteSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.getOneSauce.calledOnce).to.be.true;
// 			expect(sauceService.deleteSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(200)).to.be.true;
// 			expect(json.calledWith({ message: 'Sauce deleted' })).to.be.true;
// 		});

// 		it('should return a 400 status and error message when sauce is not found', async () => {
// 			// Arrange
// 			sauceService.getOneSauce.resolves(null);

// 			// Act
// 			await deleteSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.getOneSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(400)).to.be.true;
// 			expect(json.calledWith({ error: 'Sauce not found' })).to.be.true;
// 		});

// 		it('should return a 403 status and error message when wrong user attempts to delete', async () => {
// 			// Arrange
// 			const sauce = { userId: '2' }; // Different user
// 			sauceService.getOneSauce.resolves(sauce);

// 			// Act
// 			await deleteSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.getOneSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(403)).to.be.true;
// 			expect(json.calledWith({ message: 'Wrong user for this sauce' })).to.be.true;
// 		});

// 		it('should return a 500 status and error message on failure', async () => {
// 			// Arrange
// 			const errorMessage = 'Failed to delete sauce';
// 			sauceService.getOneSauce.rejects(new Error(errorMessage));

// 			// Act
// 			await deleteSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.getOneSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(500)).to.be.true;
// 			expect(json.calledWith({ error: errorMessage })).to.be.true;
// 		});
// 	});

// 	describe('likeSauceController', () => {
// 		beforeEach(() => {
// 			// Set up request, response objects and the parameter id
// 			req = {
// 				params: {
// 					id: '1',
// 				},
// 				body: {
// 					like: 1,
// 					userId: '1',
// 				},
// 			};
// 		});

// 		it('should update like/dislike and return a 200 status and a success message', async () => {
// 			// Arrange
// 			const sauce = { id: '1' };
// 			sauceService.getOneSauce.resolves(sauce);
// 			sauceService.likeSauce.resolves();

// 			// Act
// 			await likeSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.getOneSauce.calledOnce).to.be.true;
// 			expect(sauceService.likeSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(200)).to.be.true;
// 			expect(json.calledWith({ message: 'Like/dislike updated!' })).to.be.true;
// 		});

// 		it('should return a 400 status and error message when sauce is not found', async () => {
// 			// Arrange
// 			sauceService.getOneSauce.resolves(null);

// 			// Act
// 			await likeSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.getOneSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(400)).to.be.true;
// 			expect(json.calledWith({ error: 'Sauce not found' })).to.be.true;
// 		});

// 		it('should return a 400 status and error message on failure', async () => {
// 			// Arrange
// 			const errorMessage = 'Failed to update like/dislike';
// 			sauceService.getOneSauce.rejects(new Error(errorMessage));

// 			// Act
// 			await likeSauceController(req, res, next);

// 			// Assert
// 			expect(sauceService.getOneSauce.calledOnce).to.be.true;
// 			expect(res.status.calledWith(400)).to.be.true;
// 			expect(json.calledWith({ error: errorMessage })).to.be.true;
// 		});
// 	});
// });
