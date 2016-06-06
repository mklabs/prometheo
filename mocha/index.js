const { Client } = require('..');

// const { before, after } = require('./helpers');
// Hooks for starting prometheus
// test.before(before);
// test.after(after);

let client = new Client();
let api = 'http://localhost:9090/api/v1';
let assert = require('assert');
let util = require('util');

let str = (s) => {
  if (typeof s === 'string') return s;
  return util.inspect(s);
};

let test = (name, suite) => {
  let t = Object.assign(assert, {
    get true () { return this.truethy },

    is (actual, expected, msg) {
      msg = msg || `${actual} ${expected}`;
      return this.ok.apply(this, msg);
    },

    truethy (val, msg) {
      return t.is(val, true, `${val} not truethy`)
    }
  });

  console.log(t.is);
  return;
  if (t.skipped) it(name);

  it(name, (done) => {
    let promise = suite(t);
    if (promise instanceof Promise) {
      console.log('promise', promise);
    }

    done();
  });
};

test.skip = () => {
  test.skipped = true;
};

describe('Client', () => {

  test('Client', t => t.true(client instanceof Client));
  test('client#api', (t) => { console.log(t + ''); t.is(client.api, api) });
  test('client#options', t => t.deepEqual(client.options, {}));
  test('client#url()', t => t.is(client.url(), api))
  test('client#url("/foo/bar")', t => t.is(client.url('/foo/bar'), `${api}/foo/bar`))

  test('client#fetch("/query")', (t) => {
    console.error('Fetch!');
    return client.fetch('/query')
      .then((res) => t.deepEqual(res, {
        status: "error",
        errorType: "bad_data",
        error: "parse error at char 1: no expression found in input"
      }));
  });

  test('client#fetch("/query", { query: "up" })', (t) => {
    return client.fetch('/query', { query: 'up' })
      .then((res) => {
        t.is(res.status, 'success');
        t.is(res.data.resultType, "vector");
      });
  });

  test('client#query({ query: "up" })', (t) => {
    return client.query({ query: 'up' })
      .then((res) => {
        t.is(res.status, 'success');
        t.is(res.data.resultType, "vector");
      });
  });

  test.skip('client#range({ ... })', (t) => {
    return client.range({ query, start, end, step })
      .then((res) => {
        t.is(res.status, 'success');
        t.is(res.data.resultType, "vector");
      });
  });
});

