# Tapster
Cache adapter module for NodeJs. WIP 🚧 🚧

## Installation:
```
npm install @extensionengine/tapster
```

## Store providers
- `memory` (uses [LRU](https://github.com/isaacs/node-lru-cache))
- `redis` (uses [ioredis](https://github.com/luin/ioredis))
- custom - use any store you want, as long as it has the same API

## Usage
See examples below and in the examples directory.

### Memory store
```js
const client = new CacheManager({ store: 'memory', ttl: 10 /* seconds */ });

(async function () {
  // If the set method is called without ttl, the default ttl will be used
  await client.set('foo', 'bar');
  await client.get('foo'); // bar
  await client.has('foo') // true
  await client.has('baz'); // false

  await sleep('10s');
  await client.get('foo'); // undefined
  await client.has('foo') // false

  // When ttl is defined, it will overwrite the default one
  await client.set('foo', 'bar', 5);
  await client.has('foo') // true

  await sleep('5s');
  await client.has('foo') // false

  // ttl = 0 means no expiration time
  await client.set('foo', 'bar', 0);
})()
```

### Redis store
```js
const client = new CacheManager({
  store: 'redis',
  host: 'localhost',
  port: 6379,
  ttl: 10 /* seconds */
});

// ...
  await client.set('foo', 'bar');
  await client.get('foo'); // bar
// ...  
```

### Custom store
You can use your own custom store by creating one with the same API as the built-in memory stores (such as a memory or redis). See `example/custom-store.js`.
```js
class CustomStore { /* ... */ }
const client = new CacheManager({ store: CustomStore });

// ...
  await client.set('foo', 'bar');
  await client.get('foo'); // bar
// ...  
```
## Options
### Common
- `store` - built-in store (`memory`, `redis`) or custom store.
- `ttl` - time to live in seconds.
### Redis store
- `host` (required) - redis host.
- `port` (required) - redis port.
- `password` (optional) - redis password.

## API
- `set(key, value, ttl)` - TTL is optional. The global ttl will be used if the set method is called without a ttl parameter.
- `get(key) => value`
- `delete(key)`
- `has(key)`
- `getKeys(pattern) => keys`

Supported glob-style patterns:
- h?llo matches hello, hallo and hxllo
- h*llo matches hllo and heeeello
- h[ae]llo matches hello and hallo, but not hillo
- h[^e]llo matches hallo, hbllo, ... but not hello
- h[a-b]llo matches hallo and hbllo

## Tests
To run tests run: 
```
npm t
```

## License
Tapster is licensed under the MIT license.