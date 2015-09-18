import Ember from 'ember';
import moment from 'moment';

export default Ember.Component.extend({
  classNames: ['form-group'],
  attributeBindings: ['start', 'end', 'serverFormat'],
  start: undefined,
  end: undefined,
  timePicker: false,
  format: 'MMM D, YYYY',
  serverFormat: 'YYYY-MM-DD',
  rangeText: Ember.computed(function () {
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
  autoApply: false,
  separator: ' - ',
  singleDatePicker: false,
  placeholder: null,
  buttonClasses: ['btn'],
  applyClass: null,
  cancelClass: null,
  ranges: null,
  removeDropdownOnDestroy: false,
  cancelLabel: 'Cancel',
  applyAction: null,
  cancelAction: null,

  //Init the dropdown when the component is added to the DOM
  didInsertElement: function() {
    this.input = this.$('input');
    var self = this;

    let momentStartDate = moment(this.get('start'), this.get('serverFormat'));
    let momentEndDate = moment(this.get('end'), this.get('serverFormat'));
    let startDate = momentStartDate.isValid() ? momentStartDate : undefined;
    let endDate = momentEndDate.isValid() ? momentEndDate : undefined;

    this.$('.daterangepicker-input').daterangepicker({
      locale: {
        cancelLabel: this.get('cancelLabel'),
        format: this.get('format')
      },
      autoApply: this.get('autoApply'),
      format: this.get('format'),
      startDate: startDate,
      endDate: endDate,
      timePicker: this.get('timePicker'),
      ranges: this.get('ranges'),
      buttonClasses: this.get('buttonClasses'),
      applyClass: this.get('applyClass'),
      cancelClass: this.get('cancelClass'),
      separator: this.get('separator'),
      singleDatePicker: this.get('singleDatePicker'),
      drops: this.get('drops'),
      opens: this.get('opens')
    });

    this.$('.daterangepicker-input').on('show.daterangepicker', function(ev, picker) {
      let serverFormat = self.get('serverFormat');
      let startDate = moment(self.get('start'), serverFormat);
      let endDate = moment(self.get('end'), serverFormat);

      picker.setStartDate(startDate);
      picker.setEndDate(endDate);
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
        self.setProperties({start, end});
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
  willDestroy: function () {
    if (this.get('removeDropdownOnDestroy')) {
      Ember.$('.daterangepicker').remove();
    }
  },

  actions: {
    focusInput() {
      this.set('active', true);
      this.input.focus();
    }
  }
});
