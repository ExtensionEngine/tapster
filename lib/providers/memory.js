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
    this.ttl = config.ttl;
    this.client = new LRU();
  }

  async set(key, value, ttl = this.ttl) {
    return this.client.set(key, value, ttl * 1000 /* convert seconds to milliseconds */);
  }

  async get(key) {
    return this.client.get(key);
  }

  async has(key) {
    return this.client.has(key);
  }

  async getKeys(pattern = '*') {
    this.client.prune(); // Delete expired records
    const keys = this.client.keys().filter(Boolean);
    return micromatch(keys, pattern);
  }

  async delete(key) {
    return this.client.del(key);
  }

  static create(config) {
    return new Memory(config);
  }
}

module.exports = Memory;
