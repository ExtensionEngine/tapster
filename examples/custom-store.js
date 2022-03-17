'use strict';

const { CacheManager } = require('../lib');

class Custom {
  constructor() {
    this.entries = {};
  }

  set(key, value) {
    return Promise.resolve(this.entries[key] = value);
  }

  get(key) {
    return Promise.resolve(this.entries[key]);
  }

  has(key) {
    return Promise.resolve(!!this.entries[key]);
  }

  delete(key) {
    delete this.entries[key];
    return Promise.resolve();
  }

  getKeys() {
    return Object.keys(this.entries);
  }

  static create() {
    return new Custom();
  }
}

async function main() {
  const client = new CacheManager({ store: Custom });
  await client.set('foo', 'bar');
  console.log(await client.get('foo')); // bar
  console.log(await client.has('foo')); // true
  console.log(await client.getKeys()); // ['foo']
  await client.delete('foo');
  console.log(await client.get('foo')); // undefined
}

main();
