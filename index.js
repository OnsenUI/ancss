
var cssParse = require('css').parse;
var yaml = require('js-yaml');
var extend = require('extend');

var defaultOptions = {
  detect: function(firstLine) {
    return firstLine.match(/^\* *$/);
  }
};

/**
 * @param {String} css
 * @param {Object} [options]
 * @param {Function} [options.detect]
 * @return {Array}
 */
function parse(css, options) {
  options = extend({}, defaultOptions, options || {});

  css = css.replace(/\r/g, '');
  var lines = css.split(/\n/g);
  var parseResult = cssParse(css);

  return parseResult.stylesheet.rules.filter(function(rule) {
    if (rule.type === 'comment') {
      return options.detect(rule.comment.split(/\n/)[0] || '');
    } 
    return false;
  }).map(function(rule, index, rules) {

    var comment = normalizeComment(rule.comment);
    var nextRule = rules[index + 1];
    var css = nextRule
      ? lines.slice(rule.position.end.line, nextRule.position.start.line - 1).join('\n')
      : lines.slice(rule.position.end.line).join('\n');

    return {
      annotation: yaml.safeLoad(comment),
      css: css,
      comment: comment,
      rawComment: rule.comment,
      position: rule.position
    };
  });
};

function normalizeComment(comment) {
  return comment
    .split(/\n/g)
    .slice(1)
    .join('\n')
    .replace(/\n *\*/mg, '\n')
    .replace(/^ *\*/, '')
    .replace(/^\n+|\n+ *$/g,'');
}

module.exports = {parse: parse};
