/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');
const Memory = require('../lib/providers/memory');

describe('CacheManager', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('constructor', () => {
    it('should use memory provider when the store is set to "memory"', () => {
      const store = 'memory';
      const CacheManager = require('../lib');
      const cache = new CacheManager({ store });
      expect(cache.provider.name).to.be.eq(store);
    });

    it('should use memory provider by default', () => {
      const store = 'memory';
      const CacheManager = require('../lib');
      const cache = new CacheManager();
      expect(cache.provider.name).to.be.eq(store);
    });

    it('should use redis provider when the store is set to "redis"', () => {
      const store = 'redis';
      class Redis {
        constructor() {
          this.name = store;
        }

        static create() {
          return new this();
        }
      }
      const CacheManager = proxyquire('../lib', {
        './providers/redis': Redis
      });
      const cache = new CacheManager({ store });
      expect(cache.provider.name).to.be.eq(store);
    });

    it('should use custom store provider when the store is set to custom provider instance', () => {
      const store = 'custom-store';
      class CustomStore {
        constructor() {
          this.name = store;
        }

        static create() {
          return new this();
        }
      }
      const CacheManager = require('../lib');
      const cache = new CacheManager({ store: CustomStore });
      expect(cache.provider.name).to.be.eq(store);
    });
  });

  describe('should call provider methods', () => {
    const methods = ['set', 'get', 'has', 'getKeys', 'delete'];
    methods.forEach(method => {
      it(`should call provider ${method} method`, async () => {
        const stubMethod = sinon.spy(Memory.prototype, method);
        const CacheManager = proxyquire('../lib', {
          './providers/memory': Memory
        });
        const cache = new CacheManager();
        console.log('Testing method: ', method);
        await cache[method]();
        expect(stubMethod.calledOnce).to.be.true;
      });
    });

    methods.forEach(method => {
      it(`${method} should return a promise`, () => {
        sinon.stub(Memory.prototype, method).callsFake(() => {});
        const CacheManager = proxyquire('../lib', {
          './providers/memory': Memory
        });
        const cache = new CacheManager();
        const result = cache[method]();
        expect(result).to.be.an.instanceOf(Promise);
      });
    });
  });

  describe('namespaces', () => {
    it('should use default namespace when no namespace is specified', () => {
      const CacheManager = require('../lib');
      const cache = new CacheManager({ ttl: 10 });
      expect(cache.options.namespace).to.be.eq('default');
    });

    it('should use provided namespace', () => {
      const CacheManager = require('../lib');
      const namespace = 'test';
      const cache = new CacheManager({ namespace });
      expect(cache.options.namespace).to.be.eq(namespace);
    });

    const methods = [
      { name: 'set', args: ['foo', 'bar'] },
      { name: 'get', args: ['foo'] },
      { name: 'has', args: ['foo'] },
      { name: 'delete', args: ['foo'] },
      { name: 'getKeys', args: ['*'] }
    ];

    methods.forEach(({ name, args }) => {
      it(`${name} should call provider's ${name} using the default namespace`, async () => {
        const stubMethod = sinon.spy(Memory.prototype, name);
        const CacheManager = proxyquire('../lib', {
          './providers/memory': Memory
        });
        const [key] = args;
        const cache = new CacheManager();
        await cache[name](...args);
        expect(stubMethod.calledWith(`default:${key}`)).to.be.true;
      });
    });

    methods.forEach(({ name, args }) => {
      it(`${name} should call provider's ${name} using the given namespace`, async () => {
        const stubMethod = sinon.spy(Memory.prototype, name);
        const CacheManager = proxyquire('../lib', {
          './providers/memory': Memory
        });
        const namespace = 'test';
        const [key] = args;
        const cache = new CacheManager({ namespace });
        await cache[name](...args);
        expect(stubMethod.calledWith(`${namespace}:${key}`)).to.be.true;
      });
    });

    it('should delete all records under the certain namespace when clear method is called', async () => {
      const CacheManager = require('../lib');
      const cache = new CacheManager({ namespace: 'test-2' });
      await cache.set('foo', 'bar');
      await cache.set('zoo', 'baz');
      await cache.clear();
      const keys = await cache.getKeys();
      expect(keys.length).to.be.eq(0);
    });

    it('clear method should delete only records under the given namespace', async () => {
      const CacheManager = require('../lib');
      const cache1 = new CacheManager({ namespace: 'test-1' });
      const cache2 = new CacheManager({ namespace: 'test-2' });
      await cache1.set('foo', 'bar');
      await cache1.set('zoo', 'baz');
      await cache2.set('foo', 'bar');
      await cache2.set('zoo', 'baz');
      await cache2.clear();
      const keys = await cache1.getKeys();
      expect(keys).to.have.all.members(['foo', 'zoo']);
    });
  });
});
