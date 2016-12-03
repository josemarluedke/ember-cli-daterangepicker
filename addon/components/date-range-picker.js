import Ember from 'ember';
import moment from 'moment';

const {
  run,
  isEmpty,
  computed
} = Ember;

export default Ember.Component.extend({
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
  fromLabel: 'From',
  toLabel: 'To',
  hideAction: null,
  applyAction: null,
  cancelAction: null,
  autoUpdateInput: true,
  autoApply: false,
  alwaysShowCalendars: false,
  firstDay: 0,

  // Init the dropdown when the component is added to the DOM
  didInsertElement() {
    this._super(...arguments);
    this.setupPicker();
  },

  didUpdateAttrs() {
    this._super(...arguments);
    this.setupPicker();
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

    let options = {
      alwaysShowCalendars: this.get('alwaysShowCalendars'),
      autoUpdateInput: this.get('autoUpdateInput'),
      autoApply: this.get('autoApply'),
      locale: {
        applyLabel: this.get('applyLabel'),
        cancelLabel: this.get('cancelLabel'),
        customRangeLabel: this.get('customRangeLabel'),
        fromLabel: this.get('fromLabel'),
        toLabel: this.get('toLabel'),
        format: this.get('format'),
        firstDay: this.get('firstDay'),
        daysOfWeek: this.get('daysOfWeek'),
        monthNames: this.get('monthNames')
      },
      startDate: startDate,
      endDate: endDate,
      minDate: minDate,
      maxDate: maxDate,
      timePicker: this.get('timePicker'),
      buttonClasses: this.get('buttonClasses'),
      applyClass: this.get('applyClass'),
      cancelClass: this.get('cancelClass'),
      separator: this.get('separator'),
      singleDatePicker: this.get('singleDatePicker'),
      drops: this.get('drops'),
      opens: this.get('opens'),
      timePicker24Hour: this.get('timePicker24Hour'),
      timePickerSeconds: this.get('timePickerSeconds'),
      timePickerIncrement: this.get('timePickerIncrement'),
      showWeekNumbers: this.get('showWeekNumbers'),
      showDropdowns: this.get('showDropdowns'),
      linkedCalendars: this.get('linkedCalendars'),
      dateLimit: this.get('dateLimit'),
      parentEl: this.get('parentEl')
    };

    if (!this.get('singleDatePicker')) {
      options.ranges = this.get('ranges');
    }

    return options;
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
      let start = picker.startDate.format(this.get('serverFormat'));
      let end = picker.endDate.format(this.get('serverFormat'));
      let applyAction = this.get('applyAction');

      if (applyAction) {
        Ember.assert(
          'applyAction for date-range-picker must be a function',
          typeof applyAction === 'function'
        );
        this.sendAction('applyAction', start, end);
      } else {
        if (!this.isDestroyed) {
          this.setProperties({
            start, end
          });
        }
      }
    });

    this.$('.daterangepicker-input').on('hide.daterangepicker', (ev, picker) => {
      let start = picker.startDate.format(this.get('serverFormat'));
      let end = picker.endDate.format(this.get('serverFormat'));
      let hideAction = this.get('hideAction');

      if (hideAction) {
        Ember.assert(
          'hideAction for date-range-picker must be a function',
          typeof hideAction === 'function'
        );
        this.sendAction('hideAction', start, end);
      } else {
        if (!this.isDestroyed) {
          this.setProperties({
            start, end
          });
        }
      }
    });

    this.$('.daterangepicker-input').on('cancel.daterangepicker', () => {
      let cancelAction = this.get('cancelAction');

      if (cancelAction) {
        Ember.assert(
          'cancelAction for date-range-picker must be a function',
          typeof cancelAction === 'function'
        );
        this.sendAction('cancelAction');
      } else {
        if (!this.isDestroyed) {
          this.setProperties({
            start, end
          });
        }
      }
    });
  },

  // Remove the hidden dropdown when this component is destroyed
  willDestroy() {
    this._super(...arguments);

    run.cancel(this._setupTimer);

    if (this.get('removeDropdownOnDestroy')) {
      Ember.$('.daterangepicker').remove();
    }
  }
});
