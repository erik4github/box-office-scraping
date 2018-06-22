const json = require("./data/movies.json");
const chartjs = require("chart.js");

const movieJSON = Object.entries(json)
const allBoxOfficeNumbers = Object.values(json);

const shortest = allBoxOfficeNumbers.reduce(
    (a, c) => a.length > c.length ? c : a,
    { length: 1000 }
);

const days = (array) => array.map((v, index) => index + 1)

const stringsToNumbers = (strings) => Number(strings.replace(/[^0-9\.-]+/g, ""));

const slicer = (number, shortestArray) => number.slice(0, shortestArray.length);

const incrementalSums = (dailySums, emptyArray) => dailySums.reduce((previousValue, currentValue) => {
    const sum = previousValue + currentValue;
    emptyArray.push(sum);
    return sum;
}, 0);

// pushing currentvalue gets the individual days
// although stringsToNumbers would also be the individual days?

const parseData = (data) => {
    const arrayToChart = [];
    const alignedBoxOfficeNumbers = slicer(data, shortest).map(stringsToNumbers);
    incrementalSums(alignedBoxOfficeNumbers, arrayToChart);
    return arrayToChart;
}


document.addEventListener('DOMContentLoaded', function () {
    Chart.defaults.global.tooltips.callbacks.label = function (tooltipItem, data) {
        return '$' + tooltipItem.yLabel.toLocaleString("en-US");
    };
    const ctx = document.getElementById("myChart").getContext('2d');
    
    const grd = ctx.createLinearGradient(0, 0, window.innerWidth || document.body.clientWidth, 0);

    // Add colors
    grd.addColorStop(0.000, 'rgba(63,94,251, 1.000)');
    grd.addColorStop(1.000, 'rgba(252,70,107, 1.000)');

    const colors = [grd, 'blue', 'yellow', 'green']

    const dataToChart = movieJSON.map(([key, value], index) => {
        return {
            label: key,
            data: parseData(value),
            backgroundColor: [...colors][index],
            borderColor: [...colors][index]
        }
    })

    console.log(dataToChart);

    const chartData = {
        labels: days(shortest),
        datasets: dataToChart,
        type: 'line',
        borderWidth: 1
    }
    const myChart = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        callback: function (value, index, values) {
                            return '$' + value.toLocaleString('en-US');
                        }
                    }
                }]
            },
            elements: {
                line: {
                    fill: false
                }
            }
        }
    });
});
