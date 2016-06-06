const test = require('ava');
const { Client } = require('..');

// const { before, after } = require('./helpers');
// Hooks for starting prometheus
// test.before(before);
// test.after(after);

let client = new Client();
let api = 'http://localhost:9090/api/v1';
test('Client', t => t.true(client instanceof Client));
test('client#api', t => t.is(client.api, api));
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

test('client#range({ ... })', (t) => {
  console.log('client range', client.range);
  return client.range({ query, start, end, step })
    .then((res) => {
      t.is(res.status, 'success');
      t.is(res.data.resultType, "vector");
    });
});
