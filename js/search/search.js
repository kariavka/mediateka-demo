function drawChart(data) {
  setTimeout(function () {
    var ctx = document.getElementById("chart");
    if(!ctx || !(data && data.by_dates)){
      return;
    }
    var values = $.map(data.by_dates, function(value){
      return value;
    });

    var myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(data.by_dates),
        datasets: [{
          label: 'mentions',
          data: values,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          lineTension: 0
        }]
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
  }, 100);
}

var app = new Vue({
  el: '#search',

  data: {
    q: '',
    loading: false,
    result: null
  },

  updated: function(){
    drawChart(this.result);
  },

  computed: {
    pairs: function(){
      if(!Array.isArray(this.result && this.result.items)){
        return [];
      }
      var pairs = this.result.items.reduce(function(collection, item){
        if(collection.length === 0){
          collection.push([]);
        }
        var lastPair = collection[collection.length-1];
        if(lastPair.length<2){
          lastPair.push(item);
        } else {
          collection.push([item]);
        }
        return collection;
      }, []);

      return pairs;
    }
  },

  methods: {
    onSubmit: function () {
      if (!this.q) {
        return false;
      }
      var xhr = new XMLHttpRequest();
      var self = this;
      xhr.open('GET', 'http://mediateka.livarava.com/api/v1/medisum/?q=' + this.q);
      xhr.onload = function () {
        self.result = JSON.parse(xhr.responseText);
        self.loading = false;
      };
      xhr.onerror = function () {
        self.result = {error: true};
        self.loading = false;
      };
      xhr.send();
      this.loading = true;
    }
  }
});
