import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['form-group'],
  attributeBindings: ['start', 'end'],
  start: null,
  end: null,
  format: 'MMM D, YYYY',
  serverFormat: 'YYYY-MM-DD',
  rangeText: function() {
    var format = this.get('format');
    if (!Ember.isEmpty(this.get('start')) && !Ember.isEmpty(this.get('end'))) {
      return moment(this.get('start')).format(format) + " - " + moment(this.get('end')).format(format);
    }
  }.property('start', 'end'),

  didInsertElement: function() {
    var self = this;
    var format = this.get('format');

    this.$('.daterangepicker-input').daterangepicker({
      locale: {
        cancelLabel: 'Clear'
      },
      format: format,
      startDate: this.get('start'),
      endDate: this.get('end'),
      ranges: {
        Today: [moment(), moment()],
        Yesterday: [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
        'Last 7 Days': [moment().subtract(6, 'days'), moment()],
        'Last 30 Days': [moment().subtract(29, 'days'), moment()],
        'This Month': [moment().startOf('month'), moment().endOf('month')],
        'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      }
    });
    this.$('.daterangepicker-input').on('apply.daterangepicker', function(ev, picker) {
      self.set('start', picker.startDate.format(self.get('serverFormat')));
      self.set('end', picker.endDate.format(self.get('serverFormat')));
    });

    this.$('.daterangepicker-input').on('cancel.daterangepicker', function() {
      self.$('.daterangepicker-input').val('');
      self.set('start', null);
      self.set('end', null);
    });

    this.$('.daterangepicker-input').on('show.daterangepicker', function(ev, picker) {
      if (Ember.isEmpty(self.get('start')) && Ember.isEmpty(self.get('end'))) {
        picker.setStartDate(moment());
        picker.setEndDate(moment());
      }
    });
  }
});
