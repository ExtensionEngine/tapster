'use strict';

const LRU = require('lru-cache');
const micromatch = require('micromatch');
const yup = require('yup');

const schema = yup.object().shape({
  ttl: yup.number()
});

class Memory {
  constructor(config) {
    config = schema.validateSync(config, { stripUnknown: true });
    this.name = 'memory';
    this.ttl = config.ttl;
    this.client = new LRU();
  }

  set(key, value, ttl = this.ttl) {
    return Promise.resolve(this.client.set(key, value, ttl * 1000));
  }

  get(key) {
    return Promise.resolve(this.client.get(key));
  }

  has(key) {
    return Promise.resolve(this.client.has(key));
  }

  getKeys(pattern = '*') {
    const keys = this.client.keys().filter(Boolean);
    return Promise.resolve(micromatch(keys, pattern));
  }

  delete(key) {
    return Promise.resolve(this.client.del(key));
  }

  static create(config) {
    return new Memory(config);
  }
}

module.exports = Memory;
