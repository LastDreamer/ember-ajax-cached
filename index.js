/* jshint node: true */
'use strict';

var filterInitializers = require('fastboot-filter-initializers');

module.exports = {
  name: 'ember-ajax-cached',

  preconcatTree: function(tree) {
    return filterInitializers(tree, this.app.name);
  }
};