import PolynomialRegression from "./../../dist/PolynomialRegression"
import * as d3 from "d3"
window.d3 = d3
import nv from "nvd3"


window.addEventListener('DOMContentLoaded', () => {
    const svg = document.querySelector('svg');
    const input = document.querySelector('input[type=text]');
    const obj = runTest(3);
    graphTest(obj, svg);

    input.focus();
    input.addEventListener("input", () => {
        input.style.borderBottom = '1px solid #fff';
        if (input.value.trim().length > 0) {
            if (!isNaN(parseInt(input.value))) {
                svg.innerHTML = "";
                const obj = runTest(input.value);
                graphTest(obj, svg);
            } else {
                input.style.borderBottom = '1px solid red';
            }
        }
    })
})


function runTest(degree) {

    const someData = [];

    for (let i = 0; i < 100; i++) {
        const y = getRandomInt(5, 20);
        someData.push({
            x: i,
            y: y
        });
    }

    const poly = PolynomialRegression.read(someData, degree);
    const terms = poly.getTerms();

    const regressionData = someData.map((data) => ({
        x: data.x,
        y: poly.predictY(terms, data.x)
    }));

    return { actual: someData, regression: regressionData }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function graphTest(obj, svg) {
    /*These lines are all chart setup.  Pick and choose which chart features you want to utilize. */
    nv.addGraph(function () {
        const chart = nv.models.lineChart()
            .margin({ left: 100 })  //Adjust chart margins to give the x-axis some breathing room.
            // .useInteractiveGuideline(true)  //We want nice looking tooltips and a guideline!
            // .transitionDuration(350)  //how fast do you want the lines to transition?
            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
            .showYAxis(true)        //Show the y-axis
            .showXAxis(true)        //Show the x-axis
            ;

        chart.xAxis     //Chart x-axis settings
            .axisLabel('Bar')
            .tickFormat(d3.format(',r'));

        chart.yAxis     //Chart y-axis settings
            .axisLabel('Foo')
            .tickFormat(d3.format('.02f'));

        /* Done setting the chart up? Time to render it!*/
        const myData = [{
            values: obj.actual,      //values - represents the array of {x,y} data points
            key: 'Actual Data'
        }, {
            values: obj.regression,      //values - represents the array of {x,y} data points
            key: 'Regression Data',
            color: '#009688'
        }];   //You need data...

        d3.select(svg)    //Select the <svg> element you want to render the chart in.
            .datum(myData)         //Populate the <svg> element with chart data...
            .call(chart);          //Finally, render the chart!

        //Update the chart when window resizes.
        nv.utils.windowResize(function () {
            chart.update()
        });
        return chart;
    });
}