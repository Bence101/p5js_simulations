var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [0],
        datasets: [
          {
            label: "Number of agents",
            backgroundColor: 'rgba(100, 100, 100, 50)',
            borderColor: 'rgba(50, 50, 50, 50)',
            data: [0]
        }, 
          {
            label: "Number of grass",
            backgroundColor: 'rgba(0, 200, 20,50)',
            borderColor: 'rgba(0, 150, 15, 50)',
            data: [0]
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
    chart.update();
}

function resetChart() {
    chart.data.labels = [0];
    chart.data.datasets[0].data = [0];
    chart.data.datasets[1].data = [0];
    chart.update();
}

// function addData(chart, label, data) {
//     chart.data.labels.push(label);
//     chart.data.datasets.forEach((dataset) => {
//         dataset.data.push(data);
//     });
//     chart.update();
// }

