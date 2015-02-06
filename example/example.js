
var ancss = require('../index');
var css = require('fs').readFileSync(__dirname + '/example.css', 'utf8').toString('utf8');

ancss.parse(css).forEach(function(doc) {
  console.log('name: ' + doc.annotation.name);
  console.log('markup: ' + doc.annotation.markup);
  console.log('css: \n' + doc.css);
});

