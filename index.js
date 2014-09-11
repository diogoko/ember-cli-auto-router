'use strict';

var path = require('path');

module.exports = {
  name: 'ember-cli-auto-router',

  treeFor: function(name) {
    if (name == 'vendor') {
      return path.join('node_modules', 'ember-cli-auto-router', 'vendor');
    }
  }
};
