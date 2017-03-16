/* jshint node: true */
'use strict';
var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var path = require('path');

module.exports = {
  name: 'ember-cli-daterangepicker',

  included: function(app) {
    this._super.included.apply(this, arguments);

    if (!process.env.EMBER_CLI_FASTBOOT) {
      this.app.import('vendor/bootstrap-daterangepicker/daterangepicker.js');
      this.app.import('vendor/bootstrap-daterangepicker/daterangepicker.css');
    }
  },

  treeForVendor: function(vendorTree) {
    var trees = [];
    var daterangepickerPath = path.dirname(require.resolve('bootstrap-daterangepicker'));

    if (vendorTree) {
      trees.push(vendorTree);
    }

    trees.push(new Funnel(daterangepickerPath, {
      destDir: 'bootstrap-daterangepicker',
      include: [new RegExp(/\.js$|\.css/)],
      exclude: [
        'moment',
        'moment.min',
        'package',
        'website'
      ].map(function(key) {
        return new RegExp(key + '\.js$');
      })
    }));

    return mergeTrees(trees);
  }
};
