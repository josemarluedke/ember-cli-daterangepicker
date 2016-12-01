/* jshint node: true */

module.exports = {
  normalizeEntityName: function() {},
  
  afterInstall: function() {
    return this.addPackagesToProject([
      { name: 'bootstrap-daterangepicker' },
      { name: 'ember-cli-moment-shim' }
    ]);
  }
};