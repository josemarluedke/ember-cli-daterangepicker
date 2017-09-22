import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('date-range-picker/input', 'Integration | Component | date range picker/input', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{date-range-picker/input}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#date-range-picker/input}}
      template block text
    {{/date-range-picker/input}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
