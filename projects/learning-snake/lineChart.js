var ctx = document.getElementById('myChart').getContext('2d');
var scoreChart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [0],
        datasets: [
          {
            label: "MaxScore",
            yAxisID: 'A',
            fill: false,
            // backgroundColor: 'rgba(100, 100, 100, 50)',
            borderColor: 'rgba(87,148,223,50)',
            data: [0]
        },
          {
            label: "AvgScore",
            yAxisID: 'A',
            fill: false,
            // backgroundColor: 'rgba(100, 100, 100, 50)',
            borderColor: 'rgba(0,83,255,50)',
            data: [0]
        }, 
          {
            label: "AvgFitness",
            yAxisID: 'B',
            fill: false,
            // backgroundColor: 'rgba(0, 200, 20,50)',
            borderColor: 'rgba(0, 150, 15, 50)',
            data: [0]
        }
        ],
      
    },
    // Configuration options go here
    options: {stacked: false,
            scales: {
              yAxes: [{
                id: 'A',
                type: 'linear',
                position: 'left',
              }, {
                id: 'B',
                type: 'linear',
                position: 'right',
              }]
            }

             }
});


function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data[0])
    chart.data.datasets[1].data.push(data[1])
    chart.data.datasets[2].data.push(data[2])
    chart.update();
}