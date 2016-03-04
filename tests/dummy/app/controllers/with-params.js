import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {

    apply(startDate, endDate) {
      console.log('date range updated:', startDate + ' - ' + endDate);
    },

    cancel() {
      console.log('date range change canceled');
    }

  }

});
