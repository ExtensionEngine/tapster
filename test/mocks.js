'use strict';

class Redis {
  static create() {
    return new this();
  }
}

class CustomStore {
  static create() {
    return new this();
  }
}

class IoRedis {
  set() {}
}

module.exports = { Redis, CustomStore, IoRedis };
