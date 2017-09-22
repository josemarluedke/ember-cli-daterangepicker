import Ember from 'ember';

export default Ember.Controller.extend({
  startDate: '20140101',
  endDate: '20141231',
  actions: {
    apply(startDate, endDate, picker) {
      console.log('date range updated:', startDate + ' - ' + endDate);
      console.log('Picker: ', picker);
    },

    cancel() {
      console.log('date range change canceled');
    }
  }
});
