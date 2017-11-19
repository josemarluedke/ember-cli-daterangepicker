/* eslint-env node */

module.exports = {
  normalizeEntityName: function() {},

  afterInstall: function() {
    return this.addPackagesToProject([
      { name: 'ember-cli-moment-shim' }
    ]);
  }
};
