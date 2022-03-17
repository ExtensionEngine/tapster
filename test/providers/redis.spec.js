'use strict';

/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { IoRedis } = require('../mocks');

describe('Redis provider', () => {
  const options = { host: 'localhost', port: 6379 };

  afterEach(() => sinon.restore());

  describe('create method', () => {
    it('should have a create property of type function', () => {
      const Redis = require('../../lib/providers/redis');
      expect(Redis.create).to.be.a('function');
    });

    it('create should return the class instance', () => {
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      const client = Redis.create(options);
      expect(client).to.be.an.instanceOf(Redis);
    });

    it('create should throw an error when the host is not provided', () => {
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      expect(() => Redis.create({ port: 6379 })).to.throw;
    });

    it('create should throw an error when the port is not provided', () => {
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      expect(() => Redis.create({ host: 'localhost' })).to.throw;
    });
  });

  describe('set, get, has, getKeys, delete methods', () => {
    const Redis = require('../../lib/providers/redis');
    const methods = ['set', 'get', 'has', 'getKeys', 'delete'];
    methods.forEach(method => {
      it(`should have ${method} method`, () => {
        expect(Redis.prototype).to.respondTo(method);
      });
    });
  });

  describe('set()', () => {
    it('set method should not be called with EX parameter when ttl is 0', () => {
      const setStub = sinon.stub(IoRedis.prototype, 'set').callsFake(() => {});
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      const client = new Redis(options);
      client.set('foo', 'bar', 0);
      expect(setStub.calledWithExactly('foo', JSON.stringify('bar'))).to.be.true;
    });

    it('set method should be called with EX parameter when ttl is a positive number', () => {
      const setStub = sinon.stub(IoRedis.prototype, 'set').callsFake(() => {});
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      const client = new Redis(options);
      client.set('foo', 'bar', 1);
      expect(setStub.calledWithExactly('foo', JSON.stringify('bar'), 'EX', 1)).to.be.true;
    });

    it('set method should be called with EX parameter when ttl is a negative number', () => {
      const setStub = sinon.stub(IoRedis.prototype, 'set').callsFake(() => {});
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      const client = new Redis(options);
      client.set('foo', 'bar', -1);
      expect(setStub.calledWithExactly('foo', JSON.stringify('bar'), 'EX', -1)).to.be.true;
    });
  });
});
