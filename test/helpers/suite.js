const ava = require('ava');

class Suite {
  run () {
    var proto = Object.getPrototypeOf(this);
    var methods = Object.getOwnPropertyNames(proto);
    console.log('Suite', methods);
    methods.forEach(ava);
  }
}

module.exports = Suite;
