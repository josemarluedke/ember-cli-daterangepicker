import Ember from 'ember';
import moment from 'moment';
import layout from '../templates/components/date-range-picker';

const {
  run,
  isEmpty,
  computed
} = Ember;

const noop = function() {};

export default Ember.Component.extend({
  layout,
  classNames: ['form-group'],
  attributeBindings: ['start', 'end', 'serverFormat'],
  start: undefined,
  end: undefined,
  minDate: undefined,
  maxDate: undefined,
  timePicker: false,
  timePicker24Hour: false,
  timePickerSeconds: false,
  timePickerIncrement: undefined,
  showWeekNumbers: false,
  showDropdowns: false,
  linkedCalendars: false,
  datelimit: false,
  parentEl: 'body',
  format: 'MMM D, YYYY',
  serverFormat: 'YYYY-MM-DD',
  rangeText: computed('start', 'end', function() {
    let format = this.get('format');
    let serverFormat = this.get('serverFormat');
    let start = this.get('start');
    let end = this.get('end');
    if (!isEmpty(start) && !isEmpty(end)) {
      return moment(start, serverFormat).format(format) + this.get('separator') +
        moment(end, serverFormat).format(format);
    }
    return '';
  }),
  opens: null,
  drops: null,
  separator: ' - ',
  singleDatePicker: false,
  placeholder: null,
  buttonClasses: ['btn'],
  applyClass: null,
  cancelClass: null,
  ranges: {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  },
  daysOfWeek: moment.weekdaysMin(),
  monthNames: moment.monthsShort(),
  removeDropdownOnDestroy: false,
  cancelLabel: 'Cancel',
  applyLabel: 'Apply',
  customRangeLabel: 'Custom Range',
  showCustomRangeLabel: false,
  fromLabel: 'From',
  toLabel: 'To',
  hideAction: null,
  applyAction: null,
  cancelAction: null,
  autoUpdateInput: true,
  autoApply: false,
  alwaysShowCalendars: false,
  context: undefined,
  firstDay: 0,
  isInvalidDate: noop,
  isCustomDate: noop,

  // Init the dropdown when the component is added to the DOM
  didInsertElement() {
    this._super(...arguments);
    this.setupPicker();
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.setupPicker();
  },

  // Remove the hidden dropdown when this component is destroyed
  willDestroy() {
    this._super(...arguments);

    run.cancel(this._setupTimer);

    if (this.get('removeDropdownOnDestroy')) {
      Ember.$('.daterangepicker').remove();
    }
  },

  getOptions() {
    let momentStartDate = moment(this.get('start'), this.get('serverFormat'));
    let momentEndDate = moment(this.get('end'), this.get('serverFormat'));
    let startDate = momentStartDate.isValid() ? momentStartDate : undefined;
    let endDate = momentEndDate.isValid() ? momentEndDate : undefined;

    let momentMinDate = moment(this.get('minDate'), this.get('serverFormat'));
    let momentMaxDate = moment(this.get('maxDate'), this.get('serverFormat'));
    let minDate = momentMinDate.isValid() ? momentMinDate : undefined;
    let maxDate = momentMaxDate.isValid() ? momentMaxDate : undefined;

    let options = this.getProperties(
      'isInvalidDate',
      'isCustomDate',
      'alwaysShowCalendars',
      'autoUpdateInput',
      'autoApply',
      'timePicker',
      'buttonClasses',
      'applyClass',
      'cancelClass',
      'singleDatePicker',
      'drops',
      'opens',
      'timePicker24Hour',
      'timePickerSeconds',
      'timePickerIncrement',
      'showWeekNumbers',
      'showDropdowns',
      'linkedCalendars',
      'dateLimit',
      'parentEl'
    );

    let localeOptions = this.getProperties(
      'applyLabel',
      'cancelLabel',
      'customRangeLabel',
      'showCustomRangeLabel',
      'fromLabel',
      'toLabel',
      'format',
      'firstDay',
      'daysOfWeek',
      'monthNames',
      'separator'
    );

    const defaultOptions = {
      locale: localeOptions,
      startDate: startDate,
      endDate: endDate,
      minDate: minDate,
      maxDate: maxDate,
    };

    if (!this.get('singleDatePicker')) {
      options.ranges = this.get('ranges');
    }

    return { ...options, ...defaultOptions };
  },

  setupPicker() {
    run.cancel(this._setupTimer);
    this._setupTimer = run.scheduleOnce('afterRender', this, this._setupPicker);
  },

  _setupPicker() {
    this.$('.daterangepicker-input').daterangepicker(this.getOptions());
    this.attachPickerEvents();
  },

  attachPickerEvents() {
    this.$('.daterangepicker-input').on('apply.daterangepicker', (ev, picker) => {
      this.handleDateRangePickerEvent('applyAction', picker);
    });

    this.$('.daterangepicker-input').on('hide.daterangepicker', (ev, picker) => {
      this.handleDateRangePickerEvent('hideAction', picker);
    });

    this.$('.daterangepicker-input').on('cancel.daterangepicker', () => {
      this.handleDateRangePickerEvent('cancelAction', undefined, true);
    });
  },

  handleDateRangePickerEvent(actionName, picker, isCancel = false) {
    let action = this.get(actionName);
    let attrs = {};

    if (!isCancel) {
      let start = picker.startDate.format(this.get('serverFormat'));
      let end = picker.endDate.format(this.get('serverFormat'));
      attrs = { start, end };
    }

    if (action) {
      Ember.assert(
        `${actionName} for date-range-picker must be a function`,
        typeof action === 'function'
      );
      this.sendAction(actionName, ...attrs);
    } else {
      if (!this.isDestroyed) {
        this.setProperties(attrs);
      }
    }
  }
});
