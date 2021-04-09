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

  get namespacePrefix() {
    return `${this.namespace}:`;
  }

  async set(key, value, ttl) {
    return this.provider.set(this._getNamespacedKey(key), value, ttl);
  }

  async get(key) {
    return this.provider.get(this._getNamespacedKey(key));
  }

  async has(key) {
    return this.provider.has(this._getNamespacedKey(key));
  }

  async getKeys(pattern = '*') {
    const keys = await this.provider.getKeys(this._getNamespacedKey(pattern));
    return keys.map(this._dropNamespace);
  }

  async delete(key) {
    return this.provider.delete(this._getNamespacedKey(key));
  }

  async clear() {
    const keys = await this.getKeys();
    return Promise.all(keys.map(this.delete));
  }

  _getNamespacedKey(key) {
    return this.namespacePrefix + key;
  }

  _dropNamespace(key) {
    if (!key.startsWith(this.namespacePrefix)) return key;
    return key.substr(this.namespacePrefix.length);
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
