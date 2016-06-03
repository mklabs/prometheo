const prometheus = require('prometheus-prebuilt');
const argv = process.argv.slice(2);
const fetch = require('node-fetch');

const URL = 'http://localhost:9090/api/v1/query';
let sh = null;

let helpers = module.exports = {
  up () {
    return new Promise((r, errback) => {
      return fetch(URL)
        .catch((e) => r(false))
        .then((res) => r(true));
    });
  },

  before (t) {
    return helpers.up()
      .then((up) => {
        if (up) return Promise.resolve(true);
        return helpers.run();
      });
  },

  after() {
    console.log('cleanup, need to ?');
    return true;
  },

  run () {
    return new Promise((r, errback) => {
      console.log('proc');
      var proc = sh = prometheus.run(argv, { stdio: 'pipe' });
      proc.on('error', (err) => console.error(err));
      proc.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
      });

      proc.stderr.on('data', (data) => {
        let listening = /Listening on/.test(data + '');
        if (listening) {
          console.log(`stderr: ${data}`);

          setTimeout(r, 2000);
        }
      });
    });
  }
};

