const test = require('ava');
const prom = require('..');
const Client = prom.Client;
// const { before, after } = require('./helpers');

// test.before(before);
// test.after(after);

// Top lvl api
test('prometheo()', (t) => {
  t.is(typeof prom, 'function');
});

test('prometheo() instanceof prometheo.Client', (t) => {
  t.true(prom() instanceof prom.Client)
});
