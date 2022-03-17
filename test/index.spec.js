'use strict';

/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Memory = require('../lib/providers/memory');
const { Redis, CustomStore } = require('./mocks');

describe('CacheManager', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('constructor', () => {
    it('should use memory provider when the store is set to "memory"', () => {
      const { CacheManager } = require('../lib');
      const cache = new CacheManager({ store: 'memory' });
      expect(cache.provider).to.be.instanceOf(Memory);
    });

    it('should use memory provider by default', () => {
      const { CacheManager } = require('../lib');
      const cache = new CacheManager();
      expect(cache.provider).to.be.instanceOf(Memory);
    });

    it('should use redis provider when the store is set to "redis"', () => {
      const { CacheManager } = proxyquire('../lib', {
        './providers/redis': Redis
      });
      const cache = new CacheManager({ store: 'redis' });
      expect(cache.provider).to.be.instanceOf(Redis);
    });

    it('should use custom store provider when the store is set to custom provider instance', () => {
      const { CacheManager } = require('../lib');
      const cache = new CacheManager({ store: CustomStore });
      expect(cache.provider).to.be.instanceOf(CustomStore);
    });
  });

  describe('should have following methods', () => {
    const methods = ['set', 'get', 'has', 'getKeys', 'delete'];
    methods.forEach(method => {
      it(`should have ${method} method`, () => {
        const { CacheManager } = require('../lib');
        const cache = new CacheManager();
        expect(cache).to.respondTo(method);
      });
    });
  });

  describe('set()', () => {
    it('should throw an error when key is undefined', async () => {
      const { CacheManager } = require('../lib');
      const cache = new CacheManager();
      let error = null;
      try {
        await cache.set();
      } catch (err) {
        error = err;
      }
      expect(error).to.be.instanceOf(Error);
    });

    it('should not throw an error when key is provided', async () => {
      const { CacheManager } = require('../lib');
      const cache = new CacheManager();
      let error = null;
      try {
        await cache.set('test');
      } catch (err) {
        error = err;
      }
      expect(error).to.not.be.instanceOf(Error);
    });
  });
});
