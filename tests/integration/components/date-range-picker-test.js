import { run } from '@ember/runloop';
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import moment from 'moment';
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
    // eslint-disable-next-line no-console
    console.log('date range change canceled');
  });

  this.on('apply', function (startDate, endDate) {
    // eslint-disable-next-line no-console
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

  assert.equal(this.$('.daterangepicker').length, 1, 'did not render');
});

test('value changes when choosing Last 7 Days date range', function (assert) {
  let inputText,
    done = assert.async(),
    dateRange = moment().subtract(7, 'days').format('MMM D, YYYY') + ' - ' + moment().format('MMM D, YYYY');

  assert.expect(2);

  this.render(hbs `
    <div id="wrapper">
    {{date-range-picker
      start="2016-01-02"
      end="2016-02-28"
      parentEl="#wrapper"
    }}</div>
  `);
  assert.equal(this.$('.daterangepicker-input').val(), 'Jan 2, 2016 - Feb 28, 2016', 'date range did not match');

  // open dropdown
  this.$('.daterangepicker-input').click();

  run.later(() => {
    this.$('.daterangepicker .ranges ul > li:nth-child(3)').click();
    inputText = this.$('.daterangepicker-input').val();
    assert.equal(inputText, dateRange, 'new date range did not match');
    done();
  }, ASYNC_WAIT_TIME);

});

test('calendar renders with expected date parameters', function (assert) {
  let done = assert.async();

  this.start = '20140101';
  this.end = '20141231';

  assert.expect(3);

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

  assert.equal(this.$('.daterangepicker').hasClass('show-calendar'), false, 'dropdown menu has show-calendar class');

  // open drowdown
  this.$('.daterangepicker-input').click();

  run.later(() => {
    assert.equal(this.$('.daterangepicker').hasClass('show-calendar'), true, 'dropdown menu doesnt have show-calendar class');
    assert.equal(this.$('.daterangepicker-input').val(), `${this.get('start')} - ${this.get('end')}`, 'start date in calendar input does not match');

    done();
  }, ASYNC_WAIT_TIME);
});
