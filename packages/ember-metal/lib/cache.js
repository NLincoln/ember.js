import EmptyObject from 'ember-metal/empty_object';

export default class Cache {
  constructor(limit, func, key, store) {
    this.size   = 0;
    this.misses = 0;
    this.hits   = 0;
    this.limit  = limit;
    this.func   = func;
    this.key    = key || defaultKey;
    this.store  = store || new DefaultStore();
  }

  set(obj, value) {
    let key = this.key(obj);
    if (this.limit > this.size) {
      this.size ++;
      if (value === undefined) {
        this.store.set(key, UNDEFINED);
      } else {
        this.store.set(key, value);
      }
    }
    return value;
  }

  get(obj) {
    let key = this.key(obj);
    let value = this.store.get(key);
    if (value === undefined) {
      this.misses ++;
      value = this.set(key, this.func(obj));
    } else if (value === UNDEFINED) {
      this.hits ++;
      value = undefined;
    } else {
      this.hits ++;
      // nothing to translate
    }

    return value;
  }

  purge() {
    this.store.clear();
    this.size   = 0;
    this.hits   = 0;
    this.misses = 0;
  }
}

function UNDEFINED() {}

function defaultKey(key) {
  return key;
}

class DefaultStore {
  constructor() {
    this.data = new EmptyObject();
  }

  get(key) {
    return this.data[key];
  }

  set(key, value) {
    this.data[key] = value;
  }

  clear() {
    this.data = new EmptyObject();
  }
}
