'use strict';

const autobind = require('auto-bind');
const path = require('path');

const defaultOptions = { ttl: 0, namespace: 'default' };

class CacheManager {
  constructor(options) {
    options = { ...defaultOptions, ...options };
    this.provider = CacheManager.createProvider(options);
    this.namespace = options.namespace;
    autobind(this);
  }

  set(key, value, ttl) {
    return this.provider.set(this._getNamespacedKey(key), value, ttl);
  }

  get(key) {
    return this.provider.get(this._getNamespacedKey(key));
  }

  has(key) {
    return this.provider.has(this._getNamespacedKey(key));
  }

  getKeys(pattern = '*') {
    return this.provider.getKeys(this._getNamespacedKey(pattern));
  }

  delete(key) {
    return this.provider.delete(this._getNamespacedKey(key));
  }

  _getNamespacedKey(key) {
    return `${this.namespace}:${key}`;
  }

  static createProvider({ store = 'memory', ...options }) {
    if (typeof store === 'string') {
      return loadProvider(store).create(options);
    }
    return store.create(options);
  }
}

module.exports = CacheManager;

function loadProvider(name) {
  try {
    return require(path.join(__dirname, './providers/', name));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Unsupported provider');
    throw err;
  }
}
