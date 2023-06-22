// const { expect } = require('chai');
// const sinon = require('sinon');
// const bcrypt = require('bcrypt');
// const validator = require('validator');
// const jwt = require('jsonwebtoken');
// const User = require('../../../models/auth');
// const { createUser, loginUser } = require('../../../services/auth');

// const email = 'test@example.com';
// const password = 'password';
// const user = { email: email, password: password };

// describe('Auth Service', () => {
// 	beforeEach(() => {
// 		consoleLogStub = sinon.stub(console, 'log'); // Stub console.log before each test
// 	});

// 	afterEach(() => {
// 		sinon.restore();
// 	});

// 	describe('createUser', () => {
// 		it('should throw an error with invalid email format', async () => {
// 			sinon.stub(validator, 'isEmail').returns(false);

// 			try {
// 				await createUser(user);
// 			} catch (error) {
// 				expect(error).to.be.an('error');
// 				expect(error.message).to.equal('Invalid email format');
// 			}
// 		});

// 		it('should throw an error with weak password', async () => {
// 			sinon.stub(validator, 'isEmail').returns(true);
// 			sinon.stub(validator, 'isStrongPassword').returns(false);

// 			try {
// 				await createUser(user);
// 			} catch (error) {
// 				expect(error).to.be.an('error');
// 				expect(error.message).to.equal(
// 					'The password must contain at least 8 characters, one uppercase letter, and one special character'
// 				);
// 			}
// 		});

// 		it('should throw an error when user already exists', async () => {
// 			sinon.stub(validator, 'isEmail').returns(true);
// 			sinon.stub(validator, 'isStrongPassword').returns(true);
// 			sinon.stub(User, 'findOne').returns(true);

// 			try {
// 				await createUser(user);
// 			} catch (error) {
// 				expect(error).to.be.an('error');
// 				expect(error.message).to.equal('Email already exists');
// 			}
// 		});

// 		it('should create a new user with valid email and password', async () => {
// 			sinon.stub(validator, 'isEmail').returns(true);
// 			sinon.stub(validator, 'isStrongPassword').returns(true);
// 			sinon.stub(User, 'findOne').returns(false);
// 			sinon.stub(bcrypt, 'genSalt').returns('randomSalt');
// 			sinon.stub(bcrypt, 'hash').returns('hashedPassword');
// 			sinon.stub(User.prototype, 'save').returns(true);

// 			const result = await createUser(user);

// 			expect(result).to.be.an('object');
// 			expect(result.message).to.equal('User registration successful');
// 		});
// 	});

// 	describe('loginUser', () => {
// 		it('should throw an error with invalid email', async () => {
// 			sinon.stub(User, 'findOne').returns(null);

// 			try {
// 				await loginUser(user);
// 			} catch (error) {
// 				expect(error).to.be.an('error');
// 				expect(error.message).to.equal('Invalid email');
// 			}
// 		});

// 		it('should throw an error with invalid password', async () => {
// 			sinon.stub(User, 'findOne').returns({ email, password: 'P@ssw0rd' });
// 			sinon.stub(bcrypt, 'compare').returns(false);

// 			try {
// 				await loginUser(user);
// 			} catch (error) {
// 				expect(error).to.be.an('error');
// 				expect(error.message).to.equal('Invalid password');
// 			}
// 		});

// 		it('should login user successfully with valid email and password', async () => {
// 			const userId = 'randomUserId';

// 			sinon.stub(User, 'findOne').returns({ _id: userId, email, password });
// 			sinon.stub(bcrypt, 'compare').returns(true);
// 			sinon.stub(jwt, 'sign').returns('token');

// 			const result = await loginUser(user);

// 			expect(result).to.be.an('object');
// 			expect(result.userId).to.equal(userId);
// 			expect(result.token).to.exist;
// 		});
// 	});
// });
