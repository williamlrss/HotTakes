'use strict';

const chai = require('chai');
const sinon = require('sinon');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const authenticate = require('../../../middleware/authenticate');

const expect = chai.expect;

describe('Authenticate Middleware', () => {
	let req, res, next, errorStub;

	beforeEach(() => {
		req = httpMocks.createRequest({
			headers: {
				authorization: 'Bearer someMockToken',
			},
		});
		res = httpMocks.createResponse();
		next = sinon.stub();
		errorStub = sinon.stub(console, 'error');
		sinon.stub(jwt, 'verify').returns({ userId: 'someUserId' });
	});

	afterEach(() => {
		sinon.restore();
	});

	it('should call next when a valid token is provided', async () => {
		await authenticate(req, res, next);
		expect(req.auth.userId).to.be.equal('someUserId');
		expect(next.calledOnce).to.be.true;
	});

	it('should return 401 if no token is provided', async () => {
		req.headers.authorization = undefined;
		await authenticate(req, res, next);
		expect(res.statusCode).to.be.equal(401);
		expect(res._getJSONData()).to.be.eql({ error: 'Authentication failed, try to reconnect' });
		expect(next.called).to.be.false;
	});

	it('should return 401 if invalid token is provided', async () => {
		jwt.verify.throws(new Error('Invalid token'));
		await authenticate(req, res, next);
		expect(res.statusCode).to.be.equal(403);
		expect(res._getJSONData()).to.be.eql({
			error: 'Wrong token or outdated after one hour, please reconnect',
		});
		expect(next.called).to.be.false;
	});
});
