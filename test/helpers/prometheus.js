var prometheus = require('..');

var argv = process.argv.slice(2);
var opts = prometheus.argv(argv);

module.exports = () => prometheus.run(argv, opts);
