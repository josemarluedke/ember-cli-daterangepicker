/* jshint node: true */
'use strict';
var path = require('path');

var Funnel = require('broccoli-funnel');
var mergeTrees = require('broccoli-merge-trees');
var fbTransform = require('fastboot-transform');


module.exports = {
  name: 'ember-cli-daterangepicker',

  included: function(app) {
    this._super.included.apply(this, arguments);

    this.import('vendor/bootstrap-daterangepicker/daterangepicker.js');
    this.import('vendor/bootstrap-daterangepicker/daterangepicker.css');
  },

  treeForVendor: function(vendorTree) {
    var trees = [];
    var daterangepickerPath = path.dirname(require.resolve('bootstrap-daterangepicker'));

    if (vendorTree) {
      trees.push(vendorTree);
    }

    //need to wrap with check if it's inside fastboot environment
    trees.push(fbTransform(new Funnel(daterangepickerPath, {
      destDir: 'bootstrap-daterangepicker',
      include: [new RegExp(/\.js$/)],
      exclude: [
        'moment',
        'moment.min',
        'package',
        'website'
      ].map(function(key) {
        return new RegExp(key + '\.js$');
      })
    })));
    trees.push(new Funnel(daterangepickerPath, {
      destDir: 'bootstrap-daterangepicker',
      include: [new RegExp(/\.css$/)]
    }));

    return mergeTrees(trees);
  }
};
