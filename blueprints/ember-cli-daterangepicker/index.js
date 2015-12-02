'use strict';

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addBowerPackagesToProject([
      { name: 'bootstrap-daterangepicker', target: "~2.0.11" },
      { name: 'moment', target: ">= 2.8.0" },
      { name: 'moment-timezone', target: ">= 0.1.0" }
    ]);
  }
};
