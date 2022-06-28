const JSONB = require('json-buffer');
const CacheManager = require('../lib');

const customSerializationCache = new CacheManager({
  serialize: JSONB.stringify,
  deserialize: JSONB.parse
});

(async () => {
  await customSerializationCache.set('user', { username: 'john', password: 'john123' });

  console.log('User: ', await customSerializationCache.get('user')); // { username: 'john', password: 'john123' }
})();
