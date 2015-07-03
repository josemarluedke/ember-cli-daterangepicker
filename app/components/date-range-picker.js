import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['form-group'],
  attributeBindings: ['start', 'end'],
  start: undefined,
  end: undefined,
  timePicker: false,
  format: 'MMM D, YYYY',
  serverFormat: 'YYYY-MM-DD',
  rangeText: function() {
    var format = this.get('format');
    if (!Ember.isEmpty(this.get('start')) && !Ember.isEmpty(this.get('end'))) {
      return moment(this.get('start')).format(format) + this.get('separator') + moment(this.get('end')).format(format);
    }
    return '';
  }.property('start', 'end'),
  opens: null,
  drops: null,
  separator: ' - ',
  singleDatePicker: false,
  placeholder: null,
  buttonClasses: [],
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
  cancelLabel: 'Clear',

  //Init the dropdown when the component is added to the DOM
  didInsertElement: function() {
    var self = this;

    this.$('.daterangepicker-input').daterangepicker({
      locale: {
        cancelLabel: this.get('cancelLabel')
      },
      format: this.get('format'),
      startDate: this.get('start'),
      endDate: this.get('end'),
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
    this.$('.daterangepicker-input').on('apply.daterangepicker', function(ev, picker) {
      self.set('start', picker.startDate.format(self.get('serverFormat')));
      self.set('end', picker.endDate.format(self.get('serverFormat')));
    });

    this.$('.daterangepicker-input').on('cancel.daterangepicker', function() {
      self.set('start', undefined);
      self.set('end', undefined);
    });

    this.$('.daterangepicker-input').on('show.daterangepicker', function(ev, picker) {
      picker.setStartDate(moment(self.get('start')));
      picker.setEndDate(moment(self.get('end')));
    });
  },

  //Remove the hidden dropdown when this component is destroyed
  willDestroy: function () {
    if (this.get('removeDropdownOnDestroy')) {
      Ember.$('.daterangepicker').remove();
    }
  }
});
