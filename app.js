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

    const dataToChart = movieJSON.map(([key, value]) => {
        return {
            label: key,
            data: parseData(value),
            borderColor: 'rgba(135, 220, 90, 1.000)',
            pointBackgroundColor: 'rgba(254, 254, 254, 1.000)',
            pointBorderWidth: 10,
            pointHoverRadius: 10,
            pointHoverBorderWidth: 1,
            pointRadius: 3,
        }
    })

    const chartData = {
        datasets: dataToChart,
        labels: days(shortest),
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
