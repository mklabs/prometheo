process.env.DEBUG = 'prometheo:client';

const qs = require('qs');
const fetch = require('node-fetch');
const debug = require('micro-debug')('prometheo:client');
const { parse } = require('url');

class Client {
  get api () {
    return this.options.endpoint || 'http://localhost:9090/api/v1';
  }

  constructor (options = {}) {
    this.options = options;
  }

  fetch (path, opts)  {
    let url = this.url(path);
    let query = qs.stringify(opts);
    url = `${url}?${query}`
    console.error('Fetch %s url', url);
    return fetch(url)
      .then(res => res.json())
      .catch(e => {
        console.error('ERR', e)
      });
  }

  url (...args) {
    let {
      port,
      protocol,
      hostname,
      pathname
    } = parse(this.api);

    let api = `${protocol}//${hostname}:${port}`;
    let path = `${pathname}${args.join('/')}`.replace(/\/+/, '/');
    return api + path;
  }

  query (opts) {
    return this.fetch(`/query`, opts);
  }
}

module.exports = Client;
