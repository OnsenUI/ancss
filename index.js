
var cssParse = require('css').parse;
var yaml = require('js-yaml');
var extend = require('extend');

var defaultOptions = {
  identifyDoc: function(firstLine) {
    return firstLine.match(/^ *topdoc *$/);
  }
};

/**
 * @param {String} css
 * @param {Object} [options]
 * @param {Function} [options.identifyDoc]
 * @return {Array}
 */
function parse(css, options) {
  options = extend({}, defaultOptions, options || {});

  css = css.replace(/\r/g, '');
  var lines = css.split(/\n/g);
  var parseResult = cssParse(css);

  return parseResult.stylesheet.rules.filter(function(rule) {
    return rule.type === 'comment' && options.identifyDoc(rule.comment.split(/\n/)[0] || '');
  }).map(function(rule, index, rules) {

    var text = rule.comment.split(/\n/g).slice(1).join('\n').replace(/\n *\*/g, '\n');
    var nextRule = rules[index + 1];
    var css = nextRule
      ? lines.slice(rule.position.end.line, nextRule.position.start.line - 1).join('\n')
      : lines.slice(rule.position.end.line).join('\n');

    return {
      text: text,
      rawText: rule.comment,
      yaml: yaml.safeLoad(text),
      css: css,
      position: rule.position
    };
  });
};

function normalizeText(str) {
  return str.replace(/\n *\*/g, '\n');
}

module.exports = parse;
