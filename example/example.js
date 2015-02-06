
var parse = require('../index');
var css = require('fs').readFileSync(__dirname + '/example.css', 'utf8').toString('utf8');

parse(css).forEach(function(doc) {
  console.log(doc);
});

