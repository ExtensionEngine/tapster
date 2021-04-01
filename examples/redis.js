'use strict';

const CacheManager = require('../lib');

async function example1() {
  const client = new CacheManager({
    store: 'redis',
    host: 'localhost',
    port: 6379
  });

  await client.set('foo', 'bar');
  console.log(await client.get('foo')); // bar
  console.log(await client.has('foo')); // true
  await client.delete('foo');
  console.log(await client.get('foo')); // undefined
  console.log(await client.has('foo')); // false

  await client.set('example-1', 'example');
  await client.set('example-2', 'example');
  await client.set('lorem', 'ipsum');
  await client.set('foo', 'bar');
  console.log(await client.getKeys()); // ['foo', 'lorem', 'example-2', 'example-1']
  console.log(await client.getKeys('*')); // ['foo', 'lorem', 'example-2', 'example-1']
  console.log(await client.getKeys('example-*')); // ['example-2', 'example-1']
}

async function example2() {
  const client = new CacheManager({
    store: 'redis',
    host: 'localhost',
    port: 6379,
    ttl: 5 // time to live in seconds
  });

  await client.set('foo', 'bar');
  console.log(await client.get('foo')); // bar
  await sleep(6000); // sleep for 6000ms = 6s
  console.log(await client.get('foo')); // undefined

  const NO_EXPIRATION_TTL = 0;
  await client.set('foo', 'bar', NO_EXPIRATION_TTL);
  console.log(await client.get('foo')); // bar
  await sleep(5000); // sleep for 5000ms = 5s
  console.log(await client.get('foo')); // bar

  await client.set('foo', 'bar', 2);
  console.log(await client.get('foo')); // bar
  await sleep(2000); // sleep for 2000ms = 2s
  console.log(await client.get('foo')); // undefined
}

example1();
example2();

const sleep = time => new Promise(resolve => setTimeout(() => resolve(), time));
