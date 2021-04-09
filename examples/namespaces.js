const CacheManager = require('../lib');

const users = new CacheManager({ namespace: 'users' });
const cars = new CacheManager({ namespace: 'cars' });

(async () => {
  await users.set('user-1', 'John');
  await users.set('user-2', 'Axel');

  await cars.set('car-1', 'Honda');

  console.log('User keys: ', await users.getKeys()); // ['user-1', 'user-2'];
  console.log('Car keys: ', await cars.getKeys()); // ['car-1']

  await users.clear();

  console.log('User keys: ', await users.getKeys()); // []
  console.log('Car keys: ', await cars.getKeys()); // ['car-1']
})();
