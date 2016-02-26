import Ember from 'ember';
import moment from 'moment';

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
  parentEl: 'body',

  format: 'MMM D, YYYY',
  serverFormat: 'YYYY-MM-DD',
  rangeText: Ember.computed('start', 'end', function() {
    let format = this.get('format');
    let serverFormat = this.get('serverFormat');
    let start = this.get('start');
    let end = this.get('end');
    if (!Ember.isEmpty(start) && !Ember.isEmpty(end)) {
      return moment(start, serverFormat).format(format) + this.get('separator') + moment(end, serverFormat).format(format);
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
  removeDropdownOnDestroy: false,
  cancelLabel: 'Cancel',
  applyAction: null,
  cancelAction: null,
  autoUpdateInput: true,
  autoApply: false,

  //Init the dropdown when the component is added to the DOM
  didInsertElement: function() {
    var self = this;

    let momentStartDate = moment(this.get('start'), this.get('serverFormat'));
    let momentEndDate = moment(this.get('end'), this.get('serverFormat'));
    let startDate = momentStartDate.isValid() ? momentStartDate : undefined;
    let endDate = momentEndDate.isValid() ? momentEndDate : undefined;

    let momentMinDate = moment(this.get('minDate'), this.get('serverFormat'));
    let momentMaxDate = moment(this.get('maxDate'), this.get('serverFormat'));
    let minDate = momentMinDate.isValid() ? momentMinDate : undefined;
    let maxDate = momentMaxDate.isValid() ? momentMaxDate : undefined;

    let options = {
      autoUpdateInput: this.get('autoUpdateInput'),
      autoApply: this.get('autoApply'),
      locale: {
        cancelLabel: this.get('cancelLabel'),
        format: this.get('format')
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
      parentEl: this.get('parentEl')
    };

    if (!this.get('singleDatePicker')) {
      options.ranges = this.get('ranges');
    }

    Ember.run.scheduleOnce('afterRender', this, function() {
      this.$('.daterangepicker-input').daterangepicker(options);
    });

    this.$('.daterangepicker-input').on('apply.daterangepicker', function(ev, picker) {
      var start = picker.startDate.format(self.get('serverFormat'));
      var end = picker.endDate.format(self.get('serverFormat'));
      var applyAction = self.get('applyAction');

      if (applyAction) {
        Ember.assert(
          'applyAction for date-range-picker must be a function',
          typeof applyAction === 'function'
        );
        applyAction(start, end);
      } else {
        self.setProperties({
          start, end
        });
      }
    });

    this.$('.daterangepicker-input').on('cancel.daterangepicker', function() {
      var cancelAction = self.get('cancelAction');

      if (cancelAction) {
        Ember.assert(
          'cancelAction for date-range-picker must be a function',
          typeof cancelAction === 'function'
        );
        cancelAction();
      } else {
        self.set('start', self.get('start'));
        self.set('end', self.get('end'));
      }
    });
  },

  //Remove the hidden dropdown when this component is destroyed
  willDestroy: function() {
    if (this.get('removeDropdownOnDestroy')) {
      Ember.$('.daterangepicker').remove();
    }
  }
});
