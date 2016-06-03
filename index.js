const debug = require('micro-debug');
const Client = require('./lib/client');

// Public: prometheo() => client
//
// Returns a new Client.
let prometheo = module.exports = (options = {}) => {
  return new Client(options);
};

prometheo.Client = Client;
