'use strict';

const autobind = require('auto-bind');
const path = require('path');
const providers = require('./providers');

const defaultOptions = { store: 'memory', ttl: 0, namespace: 'default' };

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

  set(key, value, ttl) {
    if (!key) return Promise.reject(new Error('Key must be defined'));
    return this.provider.set(this._getNamespacedKey(key), value, ttl);
  }

  get(key) {
    return this.provider.get(this._getNamespacedKey(key));
  }

  has(key) {
    return this.provider.has(this._getNamespacedKey(key));
  }

  async getKeys(pattern = '*') {
    const keys = await this.provider.getKeys(this._getNamespacedKey(pattern));
    return keys.map(this._removeNamespace);
  }

  delete(key) {
    return this.provider.delete(this._getNamespacedKey(key));
  }

  async clear() {
    const keys = await this.getKeys();
    return Promise.all(keys.map(this.delete));
  }

  _getNamespacedKey(key) {
    return this.namespacePrefix + key;
  }

  _removeNamespace(key) {
    if (!key.startsWith(this.namespacePrefix)) return key;
    return key.substr(this.namespacePrefix.length);
  }

  static createProvider({ store, ...options }) {
    if (typeof store === 'string') {
      return loadProvider(store).create(options);
    }
    return store.create(options);
  }
}

module.exports = { CacheManager, providers };

function loadProvider(name) {
  try {
    return require(path.join(__dirname, './providers/', name));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') throw new Error('Unsupported provider');
    throw err;
  }
}
