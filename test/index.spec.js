'use strict';

/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const { Redis, CustomStore } = require('./mocks');

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
      const CacheManager = proxyquire('../lib', {
        './providers/redis': Redis
      });
      const cache = new CacheManager({ store: 'redis' });
      expect(cache.provider).to.be.instanceOf(Redis);
    });

    it('should use custom store provider when the store is set to custom provider instance', () => {
      const CacheManager = require('../lib');
      const cache = new CacheManager({ store: CustomStore });
      expect(cache.provider).to.be.instanceOf(CustomStore);
    });
  });

  describe('should call provider methods', () => {
    const methods = ['set', 'get', 'has', 'getKeys', 'delete'];
    methods.forEach(method => {
      it(`should call provider ${method} method`, () => {
        const CacheManager = require('../lib');
        const cache = new CacheManager();
        expect(cache).to.respondTo(method);
      });
    });
  });
});
