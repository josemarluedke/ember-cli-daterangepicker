import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
const { run } = Ember;
const ASYNC_WAIT_TIME = 500;

moduleForComponent('date-range-picker', 'Integration | Component | Date Range Picker', {
  integration: true
});

test('input renders without parameters', function (assert) {
  assert.expect(1);

  this.render(hbs `
    {{date-range-picker}}
  `);

  assert.equal(this.$('.daterangepicker-input').length, 1, 'did not render');
});

test('input renders with applyAction and cancelAction parameters', function (assert) {
  assert.expect(1);

  this.on('cancel', function () {
    console.log('date range change canceled');
  });

  this.on('apply', function (startDate, endDate) {
    console.log('date range updated:', startDate + ' - ' + endDate);
  });

  this.render(hbs `
    {{date-range-picker
      start="20140101"
      end="20141231"
      serverFormat="YYYYMMDD"
      applyAction=(action "apply")
      cancelAction=(action "cancel")
    }}
  `);

  assert.equal(this.$('.daterangepicker-input').length, 1, 'did not render');
});

test('input renders empty with autoUpdateInput parameter', function (assert) {
  assert.expect(1);

  this.render(hbs `
    {{date-range-picker
      autoUpdateInput=false
    }}
  `);

  assert.equal(this.$('.daterangepicker-input').val(), '', 'input is not empty');
});

test('dropdown menu renders', function (assert) {
  assert.expect(1);

  this.render(hbs `
    <div id="wrapper">{{date-range-picker parentEl='#wrapper'}}</div>
  `);

  assert.equal(this.$('.daterangepicker.dropdown-menu').length, 1, 'did not render');
});

test('value changes when choosing Last 7 Days date range', function (assert) {
  let inputText,
    done = assert.async(),
    dateRange = moment().subtract(6, 'days').format('MMM D, YYYY') + ' - ' + moment().format('MMM D, YYYY');

  assert.expect(2);

  this.render(hbs `
    <div id="wrapper">
    {{date-range-picker
      start="20160102"
      end="20160228"
      parentEl="#wrapper"
    }}</div>
  `);

  assert.equal(this.$('.daterangepicker-input').val(), 'Jan 2, 2016 - Feb 28, 2016', 'date range did not match');

  // open dropdown
  this.$('.daterangepicker-input').click();

  run.later(() => {
    this.$('.dropdown-menu .ranges ul > li:nth-child(3)').click();
    inputText = this.$('.daterangepicker-input').val();
    assert.equal(inputText, dateRange, 'new date range did not match');
    done();
  }, ASYNC_WAIT_TIME);

});

test('calendar renders with expected date parameters', function (assert) {
  let done = assert.async();

  this.start = '20140101';
  this.end = '20141231';

  assert.expect(4);

  this.render(hbs `
    <div id="wrapper">
    {{date-range-picker
      start=start
      end=end
      serverFormat="YYYYMMDD"
      format="YYYYMMDD"
      parentEl="#wrapper"
    }}
    </div>
  `);

  assert.equal(this.$('.dropdown-menu').hasClass('show-calendar'), false, 'dropdown menu has show-calendar class');

  // open drowdown
  this.$('.daterangepicker-input').click();

  run.later(() => {
    assert.equal(this.$('.dropdown-menu').hasClass('show-calendar'), true, 'dropdown menu doesnt have show-calendar class');

    assert.equal(this.$('.calendar.left .daterangepicker_input input').val(), this.get('start'), 'start date in calendar input does not match');

    assert.equal(this.$('.calendar.right .daterangepicker_input input').val(), this.get('end'), 'end date in calendar input does not match');

    done();
  }, ASYNC_WAIT_TIME);
});

test('moment objects are supported for start and end attributes.', function (assert) {
  assert.expect(4);

  let start = moment().subtract(3, 'days');
  let end = moment().subtract(1, 'days');
  let done = assert.async();

  this.set('start', start);
  this.set('end', end);

  this.render(hbs `
    <div id="wrapper">
    {{date-range-picker
      start=end
      end=end
      parentEl="#wrapper"
    }}</div>
  `);

  assert.equal(this.get('end')._isAMomentObject, true, 'end starts as a moment object');
  assert.equal(this.get('start')._isAMomentObject, true, 'start starts as a moment object');

  run.later(() => {
    this.$('.daterangepicker-input').click();
    this.$('.dropdown-menu .ranges ul > li:nth-child(5)').click();
  });

  run.later(() => {

    assert.equal(this.get('end')._isAMomentObject, true, 'end is still a moment object');
    assert.equal(this.get('start')._isAMomentObject, true, 'start is still a moment object');

    done();
  }, ASYNC_WAIT_TIME);

});
