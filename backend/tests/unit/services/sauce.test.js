const sinon = require('sinon');
const { expect } = require('chai');
const Sauce = require('../../../models/sauce');
const {
	getAllSauces,
	getOneSauce,
	createSauce,
	updateSauce,
	deleteSauce,
	likeSauce,
} = require('../../../services/sauce');
const logger = require('../../../utils/winston');
const fsPromises = require('fs').promises;

const imageUrl = 'http://example.com/test.jpg';

const validUserId = '1234567890';

const validSauceData = {
	userId: '1234567890',
	name: 'Test Sauce',
	manufacturer: 'Test Manufacturer',
	description: 'This is a test sauce',
	mainPepper: 'Test Pepper',
	heat: 5,
};

const sauceDataMissingUserId = {
	name: 'Test Sauce',
	manufacturer: 'Test Manufacturer',
	description: 'This is a test sauce',
	mainPepper: 'Test Pepper',
	heat: 5,
};

const validSauce = {
	_id: '1',
	...validSauceData,
	imageUrl,
	likes: 0,
	dislikes: 0,
	usersLiked: [],
	usersDisliked: [],
};

const sauceLiked = {
	_id: '1',
	...validSauceData,
	imageUrl,
	likes: 1,
	dislikes: 0,
	usersLiked: [validUserId],
	usersDisliked: [],
};

const sauceDisliked = {
	_id: '1',
	...validSauceData,
	imageUrl,
	likes: 0,
	dislikes: 1,
	usersLiked: [],
	usersDisliked: [validUserId],
};

const invalidSauce = {
	_id: '1',
	...validSauceData,
	imageUrl,
	likes: 0,
	dislikes: 0,
};

const sauces = [
	{ _id: '1', name: 'Test Sauce 1' },
	{ _id: '2', name: 'Test Sauce 2' },
];

describe('Sauce service', () => {
	describe('getAllSauces', () => {
		let findStub;

		beforeEach(() => {
			findStub = sinon.stub(Sauce, 'find');
		});

		afterEach(() => {
			findStub.restore();
		});

		it('should retrieve all sauces', async () => {
			findStub.resolves(sauces);

			const result = await getAllSauces();

			expect(result).to.deep.equal(sauces);
			expect(findStub.calledOnce).to.be.true;
		});
	});

	describe('getOneSauce', () => {
		let findByIdStub;

		beforeEach(() => {
			findByIdStub = sinon.stub(Sauce, 'findById');
		});

		afterEach(() => {
			findByIdStub.restore();
		});

		it('should retrieve a sauce by id', async () => {
			findByIdStub.resolves(validSauce);

			const result = await getOneSauce(validSauce._id);

			expect(result).to.deep.equal(validSauce);
			expect(findByIdStub.calledOnce).to.be.true;
		});

		it('should throw error when id is missing', async () => {
			try {
				await getOneSauce();
			} catch (error) {
				expect(error.message).to.equal('getOneSauce missing id');
			}
		});

		it('should throw error when not found', async () => {
			response = await getOneSauce('wrongSauceId');

			console.log(response.body);
			expect(response.error).to.equal('Sacuce not found');
		});
	});

	describe('createSauce', () => {
		let saveStub, loggerErrorStub;

		beforeEach(() => {
			saveStub = sinon.stub(Sauce.prototype, 'save');
			loggerErrorStub = sinon.stub(logger, 'error');
		});

		afterEach(() => {
			saveStub.restore();
			loggerErrorStub.restore();
		});

		it('should successfully create a sauce', async () => {
			saveStub.resolves(validSauce);

			await createSauce(validSauceData, imageUrl);

			expect(saveStub.calledOnce).to.be.true;
			expect(loggerErrorStub.called).to.be.false;
		});

		it('should throw error when parameters are missing', async () => {
			try {
				await createSauce(sauceDataMissingUserId, imageUrl);
			} catch (error) {
				console.log(error);
				expect(error.message).to.equal('CreateSauce missing parameters: userId');
				expect(loggerErrorStub.called).to.be.true;
			}
		});

		it('should handle error when save fails', async () => {
			const testError = new Error('Test Error');
			saveStub.rejects(testError);

			try {
				await createSauce(validSauceData, imageUrl);
			} catch (error) {
				expect(error).to.equal(testError);
				expect(loggerErrorStub.calledOnce).to.be.true;
			}
		});
	});

	describe('updateSauce', () => {
		let findByIdStub, saveStub, unlinkStub;

		beforeEach(() => {
			findByIdStub = sinon.stub(Sauce, 'findById');
			saveStub = sinon.stub(Sauce.prototype, 'save');
			unlinkStub = sinon.stub(fsPromises, 'unlink');
		});

		afterEach(() => {
			findByIdStub.restore();
			saveStub.restore();
			unlinkStub.restore();
		});

		it('should successfully update a sauce', async () => {
			const mongooseDocumentInstance = Object.assign({}, validSauce, {
				save: sinon.stub().resolves(validSauce),
			});
			findByIdStub.resolves(mongooseDocumentInstance);
			saveStub.resolves(mongooseDocumentInstance);

			const updatedSauce = await updateSauce(
				validSauce._id,
				validSauce.userId,
				validSauceData,
				imageUrl
			);

			expect(findByIdStub.calledOnce).to.be.true;
			expect(updatedSauce).to.deep.equal(validSauce);
		});

		it('should throw an error if sauce id is not found', async () => {
			findByIdStub.resolves('');

			try {
				await updateSauce('', validUserId, validSauceData, imageUrl);
			} catch (error) {
				expect(error.message).to.equal('missing parameters: id');
			}

			expect(findByIdStub.calledOnce).to.be.true;
			expect(saveStub.called).to.be.false;
		});

		it('should throw an error if wrong user is trying to update the sauce', async () => {
			findByIdStub.resolves(validSauce);

			try {
				await updateSauce(validSauce._id, '', validSauceData, imageUrl);
			} catch (error) {
				expect(error.message).to.equal('missing parameters: userId');
			}

			expect(findByIdStub.calledOnce).to.be.true;
			expect(saveStub.called).to.be.false;
		});

		it('should delete old image and update imageUrl if new imageUrl is provided', async () => {
			const oldImageUrl = validSauce.imageUrl;
			const newImageUrl = 'http://example.com/newImage.jpg';
			oldImageName = oldImageUrl.split('/').pop();
			const updatedSauce = { ...validSauce, imageUrl: newImageUrl };

			const mongooseDocumentInstance = Object.assign({}, updatedSauce, {
				save: sinon.stub().resolves(updatedSauce),
			});
			findByIdStub.resolves(mongooseDocumentInstance);
			saveStub.resolves(mongooseDocumentInstance);

			const result = await updateSauce(
				validSauce._id,
				validSauce.userId,
				validSauceData,
				newImageUrl
			);

			expect(result).to.deep.equal(updatedSauce);
			expect(findByIdStub.calledOnce).to.be.true;
			expect(unlinkStub.called).to.be.true;
		});
	});

	describe('deleteSauce', () => {
		let findByIdStub, deleteOneStub, unlinkStub, loggerErrorStub;

		beforeEach(() => {
			findByIdStub = sinon.stub(Sauce, 'findById');
			deleteOneStub = sinon.stub(Sauce, 'deleteOne');
			unlinkStub = sinon.stub(fsPromises, 'unlink');
			loggerErrorStub = sinon.stub(logger, 'error');
		});

		afterEach(() => {
			findByIdStub.restore();
			deleteOneStub.restore();
			unlinkStub.restore();
			loggerErrorStub.restore();
		});

		it('should successfully delete a sauce', async () => {
			const mongooseDocumentInstance = Object.assign({}, validSauce, {
				deleteOne: sinon.stub().resolves(),
			});
			findByIdStub.resolves(mongooseDocumentInstance);
			await deleteSauce(validSauce._id);
			expect(findByIdStub.calledOnce).to.be.true;
			expect(unlinkStub.calledOnce).to.be.true;
			expect(mongooseDocumentInstance.deleteOne.calledOnce).to.be.true;
			expect(loggerErrorStub.called).to.be.false;
		});

		it('should throw an error if id is not provided', async () => {
			try {
				await deleteSauce();
			} catch (error) {
				expect(error.message).to.equal('deleteSauce missing or wrong id');
			}
			expect(findByIdStub.called).to.be.false;
			expect(loggerErrorStub.calledOnce).to.be.true;
		});

		it('should handle error when sauce is not found', async () => {
			findByIdStub.resolves(null);
			try {
				await deleteSauce(validSauce._id);
			} catch (error) {
				expect(error.message).to.equal('deleteSauce sauce not found');
			}
			expect(findByIdStub.calledOnce).to.be.true;
			expect(loggerErrorStub.calledOnce).to.be.true;
		});

		it('should handle error when file unlink fails', async () => {
			const unlinkError = new Error('unlink failed');
			const mongooseDocumentInstance = Object.assign({}, validSauce, {
				deleteOne: sinon.stub().resolves(),
			});
			findByIdStub.resolves(mongooseDocumentInstance);
			unlinkStub.rejects(unlinkError);
			try {
				await deleteSauce(validSauce._id);
			} catch (error) {
				expect(error).to.equal(unlinkError);
			}
			expect(findByIdStub.calledOnce).to.be.true;
			expect(unlinkStub.calledOnce).to.be.true;
		});
	});

	describe('likeSauce', () => {
		let findByIdStub, saveStub, loggerErrorStub;

		beforeEach(() => {
			findByIdStub = sinon.stub(Sauce, 'findById');
			saveStub = sinon.stub(Sauce.prototype, 'save');
			loggerErrorStub = sinon.stub(logger, 'error');
		});

		afterEach(() => {
			// Restore the stubs after each test
			findByIdStub.restore();
			saveStub.restore();
			loggerErrorStub.restore();
		});

		it('should successfully like a sauce', async () => {
			const mongooseDocumentInstance = Object.assign({}, validSauce, {
				save: sinon.stub().resolves(validSauce),
			});
			findByIdStub.resolves(mongooseDocumentInstance);

			await likeSauce(validSauce._id, 1, validUserId);

			expect(findByIdStub.calledOnce).to.be.true;
			expect(mongooseDocumentInstance.usersLiked.includes(validUserId)).to.be.true;
			expect(mongooseDocumentInstance.usersDisliked.includes(validUserId)).to.be.false;
			expect(mongooseDocumentInstance.likes).to.equal(1);
			expect(mongooseDocumentInstance.dislikes).to.equal(0);
			expect(loggerErrorStub.called).to.be.false;
		});

		it('should successfully unlike a sauce', async () => {
			const mongooseDocumentInstance = Object.assign({}, sauceLiked, {
				save: sinon.stub().resolves(sauceLiked),
			});
			findByIdStub.resolves(mongooseDocumentInstance);

			expect(mongooseDocumentInstance.usersLiked.includes(validUserId)).to.be.true;
			expect(mongooseDocumentInstance.likes).to.equal(1);

			await likeSauce(sauceLiked._id, 0, validUserId);

			expect(findByIdStub.calledOnce).to.be.true;
			expect(mongooseDocumentInstance.usersLiked.includes(validUserId)).to.be.false;
			expect(mongooseDocumentInstance.usersDisliked.includes(validUserId)).to.be.false;
			expect(mongooseDocumentInstance.likes).to.equal(0);
			expect(mongooseDocumentInstance.dislikes).to.equal(0);
			expect(loggerErrorStub.called).to.be.false;
		});

		it('should successfully dislike a sauce', async () => {
			const mongooseDocumentInstance = Object.assign({}, validSauce, {
				save: sinon.stub().resolves(validSauce),
			});
			findByIdStub.resolves(mongooseDocumentInstance);

			await likeSauce(validSauce._id, -1, validUserId);

			expect(findByIdStub.calledOnce).to.be.true;
			expect(mongooseDocumentInstance.usersLiked.includes(validUserId)).to.be.false;
			expect(mongooseDocumentInstance.usersDisliked.includes(validUserId)).to.be.true;
			expect(mongooseDocumentInstance.likes).to.equal(0);
			expect(mongooseDocumentInstance.dislikes).to.equal(1);
			expect(loggerErrorStub.called).to.be.false;
		});

		it('should successfully undislike a sauce', async () => {
			const mongooseDocumentInstance = Object.assign({}, sauceDisliked, {
				save: sinon.stub().resolves(sauceDisliked),
			});
			findByIdStub.resolves(mongooseDocumentInstance);

			expect(mongooseDocumentInstance.usersDisliked.includes(validUserId)).to.be.true;
			expect(mongooseDocumentInstance.dislikes).to.equal(1);

			await likeSauce(sauceDisliked._id, 0, validUserId);

			expect(findByIdStub.calledOnce).to.be.true;
			expect(mongooseDocumentInstance.usersLiked.includes(validUserId)).to.be.false;
			expect(mongooseDocumentInstance.usersDisliked.includes(validUserId)).to.be.false;
			expect(mongooseDocumentInstance.likes).to.equal(0);
			expect(mongooseDocumentInstance.dislikes).to.equal(0);
			expect(loggerErrorStub.called).to.be.false;
		});

		it('should handle error when id is not provided', async () => {
			try {
				await likeSauce(undefined, 1, validUserId);
			} catch (error) {
				expect(error.message).to.equal('missing parameters: id');
			}
		});

		it('should handle error when userId is not provided', async () => {
			try {
				await likeSauce(validSauce._id, 1, undefined);
			} catch (error) {
				expect(error.message).to.equal('missing parameters: userId');
			}
		});

		it('should handle error when sauce is invalid', async () => {
			try {
				await likeSauce(invalidSauce._id, 1, validUserId);
			} catch (error) {
				expect(error.message).to.equal('Invalid sauce object');
			}
		});
	});
});
