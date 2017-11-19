import Controller from '@ember/controller';

export default Controller.extend({
  startDate: '20140101',
  endDate: '20141231',
  actions: {
    apply(startDate, endDate, picker) {
      // eslint-disable-next-line no-console
      console.log('date range updated:', startDate + ' - ' + endDate);
      // eslint-disable-next-line no-console
      console.log('Picker: ', picker);
    },

    cancel() {
      // eslint-disable-next-line no-console
      console.log('date range change canceled');
    }
  }
});
