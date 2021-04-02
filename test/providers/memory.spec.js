/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const Memory = require('../../lib/providers/memory');

describe('Memory provider', () => {
  describe('create method', () => {
    it('should have a create property', () => {
      expect(Memory).to.have.a.property('create');
    });

    it('create should be a function', () => {
      expect(Memory.create).to.be.a('function');
    });

    it('create should return the class instance', () => {
      const memory = Memory.create();
      expect(memory).to.be.an.instanceOf(Memory);
    });
  });

  describe('set, get, has, getKeys, delete methods', () => {
    const memory = new Memory();
    const methods = ['set', 'get', 'has', 'getKeys', 'delete'];
    methods.forEach(method => {
      it(`should have ${method} method`, () => {
        expect(Memory.prototype).to.have.a.property(method);
      });
    });

    methods.forEach(method => {
      it(`${method} should return a promise`, () => {
        const result = memory[method]();
        expect(result).to.be.an.instanceOf(Promise);
      });
    });
  });

  describe('getKeys()', () => {
    const records = ['user-1', 'user-2', 'something', 'else'];
    let memory;

    beforeEach(async () => {
      memory = new Memory();
      await Promise.all(records.map(async record => {
        await memory.set(record, 'test');
      }));
    });

    it('should return all keys when * pattern is used', async () => {
      const keys = await memory.getKeys('*');
      expect(keys).to.have.all.members(records);
    });

    it('should use default pattern = * when the pattern is not set', async () => {
      const keys = await memory.getKeys();
      expect(keys).to.have.all.members(records);
    });

    it('should return keys that match the given pattern', async () => {
      const keys = await memory.getKeys('user-*');
      expect(keys).to.have.all.members(['user-1', 'user-2']);
    });
  });
});