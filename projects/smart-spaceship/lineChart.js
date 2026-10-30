var ctx = document.getElementById('myChart').getContext('2d');
var performanceChart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        // labels: [0],
        datasets: [
          {
            label: "Rate of deaths",
            backgroundColor: 'rgba(200, 0, 20, 50)',
            borderColor: 'rgba(150, 0, 15, 50)',
            data: []
            // data: [0]
        },
          {
            label: "Rate of non-finishers",
            backgroundColor: 'rgba(255, 255, 128,50)',
            borderColor: 'rgba(200, 200, 100, 50)',
            data: []
            // data: [0]
        },
          {
            label: "Rate of finishers",
            backgroundColor: 'rgba(0, 200, 20,50)',
            borderColor: 'rgba(0, 150, 15, 50)',
            data: []
            // data: [0]
        }
        ],
      
    },
    // Configuration options go here
    options: {scales: {
            yAxes: [{stacked: true}]
            }}
});


function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data[0])
    chart.data.datasets[1].data.push(data[1])
    chart.data.datasets[2].data.push(data[2])
    chart.update();
}

function resetPerformanceChart() {
  performanceChart.data.labels = [];
  for (const dataset of performanceChart.data.datasets) {
    dataset.data = [];
  }
  performanceChart.update(0);
}
