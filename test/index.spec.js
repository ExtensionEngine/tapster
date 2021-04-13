/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const Memory = require('../lib/providers/memory');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

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
      it(`should call provider ${method} method`, () => {
        const stubMethod = sinon.stub(Memory.prototype, method).callsFake(() => {});
        const CacheManager = proxyquire('../lib', {
          './providers/memory': Memory
        });
        const cache = new CacheManager();
        cache[method]();
        expect(stubMethod.calledOnce).to.be.true;
      });
    });
  });
});
