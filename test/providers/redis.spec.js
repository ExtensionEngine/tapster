/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('Redis provider', () => {
  const options = { host: 'localhost', port: 6379 };

  afterEach(() => sinon.restore());

  describe('create method', () => {
    it('should have a create property', () => {
      const Redis = require('../../lib/providers/redis');
      expect(Redis).to.have.a.property('create');
    });

    it('create should be a function', () => {
      const Redis = require('../../lib/providers/redis');
      expect(Redis.create).to.be.a('function');
    });

    it('create should return the class instance', () => {
      class IoRedis {}
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      const client = Redis.create(options);
      expect(client).to.be.an.instanceOf(Redis);
    });

    it('create should throw an error when the host is not provided', () => {
      class IoRedis {}
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      expect(() => Redis.create({ port: 6379 })).to.throw;
    });

    it('create should throw an error when the port is not provided', () => {
      class IoRedis {}
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      expect(() => Redis.create({ host: 'localhost' })).to.throw;
    });
  });

  describe('set, get, has, getKeys, delete methods', () => {
    const Redis = require('../../lib/providers/redis');
    const methods = ['set', 'get', 'has', 'getKeys', 'delete'];
    methods.forEach(method => {
      it(`should have ${method} method`, () => {
        expect(Redis.prototype).to.have.a.property(method);
      });
    });
  });

  describe('set()', () => {
    it('set method should not be called with EX parameter when ttl is 0', () => {
      class IoRedis {
        set() {}
      }
      const setStub = sinon.stub(IoRedis.prototype, 'set').callsFake(() => {});
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      const client = new Redis(options);
      client.set('foo', 'bar', 0);
      const [key, value] = setStub.getCall(0).args;
      expect(setStub.calledWith(key, value, 'EX')).to.be.false;
    });

    it('set method should be called with EX parameter when ttl is a positive number', () => {
      class IoRedis {
        set() {}
      }
      const setStub = sinon.stub(IoRedis.prototype, 'set').callsFake(() => {});
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      const client = new Redis(options);
      client.set('foo', 'bar', 1);
      const [key, value] = setStub.getCall(0).args;
      expect(setStub.calledWithExactly(key, value, 'EX', 1)).to.be.true;
    });

    it('set method should be called with EX parameter when ttl is a negative number', () => {
      class IoRedis {
        set() {}
      }
      const setStub = sinon.stub(IoRedis.prototype, 'set').callsFake(() => {});
      const Redis = proxyquire('../../lib/providers/redis', { ioredis: IoRedis });
      const client = new Redis(options);
      client.set('foo', 'bar', -1);
      const [key, value] = setStub.getCall(0).args;
      expect(setStub.calledWithExactly(key, value, 'EX', -1)).to.be.true;
    });
  });
});
