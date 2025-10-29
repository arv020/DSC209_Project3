// // Automatically download D3 and SheetJS from CDNs
// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
// import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';

// async function loadAbortionData() {
//   try {
//     const response = await fetch('GuttmacherInstituteAbortionDataByState.xlsx');
//     const arrayBuffer = await response.arrayBuffer();

//     const workbook = XLSX.read(arrayBuffer, { type: 'array' });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];

//     const abortionData = XLSX.utils.sheet_to_json(sheet);
//     return abortionData;

//   } catch (error) {
//     console.error('Error loading abortion data:', error);
//   }
// }

// // Example use
// loadAbortionData().then(abortionData => {
//   console.log('Loaded Excel data:', abortionData);
// });


// const svg = d3.select('#abortion-plot');

// const width = 1000;
// const height = 300;
// const margin = { top: 20, right: 20, bottom: 30, left: 40 };

// svg.attr('width', width);
// svg.attr('height', height);

// // Create scales
// const xScale = d3
//   .scaleLinear()
//   .domain([0, abortionData.hourly.temperature_2m.length - 1])
//   .range([margin.left, width - margin.right]);

// const yScale = d3
//   .scaleLinear()
//   .domain([
//     d3.min(abortionData.hourly.temperature_2m),
//     d3.max(abortionData.hourly.temperature_2m),
//   ])
//   .range([height - margin.bottom, margin.top]);

// svg
//   .selectAll('circle')
//   .data(abortionData.hourly.temperature_2m)
//   .join('circle')
//   .attr('cx', (d, i) => xScale(i))
//   .attr('cy', (d) => yScale(d))
//   .attr('r', 2);
// Import D3 and SheetJS from CDNs
// Automatically download D3 and SheetJS from CDNs
 
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';

const columnState = "U.S. State"; // For tooltips

async function loadAbortionData() {
  try {
    const response = await fetch('GuttmacherInstituteAbortionDataByState.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);
    return data;
  } catch (error) {
    console.error('Error loading abortion data:', error);
  }
}

loadAbortionData().then(data => {
  console.log('Loaded Excel data:', data);

  // -------------------- DIVERGENT BAR CHART (INTERACTIVE) -------------------- //
const barMargin = { top: 0, right: 20, bottom: 50, left: 80 },
      barWidth = 900 - barMargin.left - barMargin.right,
      barHeight = 400 - barMargin.top - barMargin.bottom;

const barSvg = d3.select('#bar-chart')
  .append('svg')
  .attr('width', barWidth + barMargin.left + barMargin.right)
  .attr('height', barHeight + barMargin.top + barMargin.bottom)
  .append('g')
  .attr('transform', `translate(${barMargin.left},${barMargin.top})`);

const negativeCol = '% of women aged 15–44 living in a county without a clinic, 2020';
const positiveCol = '% of residents obtaining abortions who traveled out of state for care, 2020';

// Scales
const xBar = d3.scaleBand()
  .domain(data.map(d => d[columnState]))
  .range([0, barWidth])
  .padding(0.2);

const yBar = d3.scaleLinear()
  .domain([
    -d3.max(data, d => +d[negativeCol] || 0) * 1.1,
     d3.max(data, d => +d[positiveCol] || 0) * 1.1
  ])
  .range([barHeight, 0]);

// Axes
barSvg.append('g')
  .attr('transform', `translate(0,${barHeight / 2})`) // zero line
  .call(d3.axisBottom(xBar))
  .selectAll("text")
  .attr("transform", "rotate(-60)")
  .style("text-anchor", "end");

barSvg.append('g')
  .call(d3.axisLeft(yBar).ticks(10).tickFormat(d => Math.abs(d) + '%'));

// Tooltip
const barTooltip = d3.select('body')
  .append('div')
  .attr('class', 'tooltip')
  .style('position', 'absolute')
  .style('visibility', 'hidden')
  .style('background', '#fff')
  .style('padding', '8px')
  .style('border', '1px solid #ccc')
  .style('border-radius', '4px')
  .style('font-size', '13px');

barSvg.selectAll('.negative-bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'negative-bar')
  .attr('x', d => xBar(d[columnState]))
  .attr('y', d => yBar(0)) // start at the zero line
  .attr('width', xBar.bandwidth())
  .attr('height', d => yBar(0) - yBar(-d[negativeCol])) // calculate height properly
  .attr('fill', '#d95f02')
  .on('mouseover', function(event, d) {
    d3.select(this).attr('opacity', 0.8);
    barTooltip.style('visibility', 'visible')
      .html(
        `<b>${d[columnState]}</b><br>` +
        `${negativeCol}: ${d[negativeCol]}%<br>` +
        `${positiveCol}: ${d[positiveCol]}%`
      );
  })
  .on('mousemove', event => {
    barTooltip.style('top', (event.pageY - 40) + 'px')
              .style('left', (event.pageX + 10) + 'px');
  })
  .on('mouseout', function() {
    d3.select(this).attr('opacity', 1);
    barTooltip.style('visibility', 'hidden');
  });


barSvg.selectAll('.positive-bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'positive-bar')
  .attr('x', d => xBar(d[columnState]))
  .attr('y', d => yBar(d[positiveCol]))
  .attr('width', xBar.bandwidth())
  .attr('height', d => yBar(0) - yBar(d[positiveCol]))
  .attr('fill', '#1b9e77')
  .on('mouseover', function(event, d) {
    d3.select(this).attr('opacity', 0.8);
    barTooltip.style('visibility', 'visible')
      .html(
        `<b>${d[columnState]}</b><br>` +
        `${negativeCol}: ${d[negativeCol]}%<br>` +
        `${positiveCol}: ${d[positiveCol]}%`
      );
  })
  .on('mousemove', event => {
    barTooltip.style('top', (event.pageY - 40) + 'px')
              .style('left', (event.pageX + 10) + 'px');
  })
  .on('mouseout', function() {
    d3.select(this).attr('opacity', 1);
    barTooltip.style('visibility', 'hidden');
  });

// Labels
barSvg.append('text')
  .attr('x', barWidth / 2)
  .attr('y', -20)
  .attr('text-anchor', 'middle')
  .attr('font-size', '18px')
  .text('Local Clinic Access vs Out-of-State Travel by State');

// Legend
const legend = barSvg.append('g')
  .attr('transform', `translate(${barWidth - 250},0)`);

legend.append('rect').attr('x',0).attr('y',0).attr('width',15).attr('height',15).attr('fill','#d95f02');
legend.append('text').attr('x',20).attr('y',12).text('% Women in counties without a clinic');

legend.append('rect').attr('x',0).attr('y',25).attr('width',15).attr('height',15).attr('fill','#1b9e77');
legend.append('text').attr('x',20).attr('y',37).text('% Residents traveling out of state');


  // -------------------- SCATTER PLOT -------------------- //
  const scatterMargin = { top: 50, right: 50, bottom: 60, left: 80 },
        scatterWidth = 700,
        scatterHeight = 400;

  const xColScatter = '% of counties without a known clinic, 2020';
  const yColScatter = '% of residents obtaining abortions who traveled out of state for care, 2020';

  const scatterSvg = d3.select('#scatter-plot')
    .append('svg')
    .attr('width', scatterWidth + scatterMargin.left + scatterMargin.right)
    .attr('height', scatterHeight + scatterMargin.top + scatterMargin.bottom)
    .append('g')
    .attr('transform', `translate(${scatterMargin.left},${scatterMargin.top})`);

  const xScatter = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[xColScatter])])
    .range([0, scatterWidth]);

  const yScatter = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[yColScatter])])
    .range([scatterHeight, 0]);

  // Axes
  scatterSvg.append('g')
    .attr('transform', `translate(0,${scatterHeight})`)
    .call(d3.axisBottom(xScatter).ticks(10).tickFormat(d => d + '%'));

  scatterSvg.append('g')
    .call(d3.axisLeft(yScatter).ticks(10).tickFormat(d => d + '%'));

  // Labels
  d3.select('#scatter-plot svg')
    .append('text')
    .attr('x', (scatterWidth + scatterMargin.left + scatterMargin.right) / 2)
    .attr('y', scatterMargin.top / 2)
    .attr('text-anchor', 'middle')
    .attr('font-size', '18px')
    .text('Counties without Clinic vs Out-of-State Travel');

  // X label
  d3.select('#scatter-plot svg')
    .append('text')
    .attr('x', (scatterWidth + scatterMargin.left + scatterMargin.right) / 2)
    .attr('y', scatterHeight + scatterMargin.top + scatterMargin.bottom - 10)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .text('% of counties without a clinic (2020)');

  // Y label
  d3.select('#scatter-plot svg')
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', - (scatterHeight + scatterMargin.top) / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('font-size', '14px')
    .text('% of residents traveling out of state (2020)');

  // Tooltip
  const scatterTooltip = d3.select('body')
    .append('div')
    .style('position', 'absolute')
    .style('background', 'white')
    .style('border', '1px solid #ccc')
    .style('padding', '6px 10px')
    .style('border-radius', '5px')
    .style('pointer-events', 'none')
    .style('font-size', '13px')
    .style('visibility', 'hidden');

  // Points
  scatterSvg.selectAll('.point')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'point')
    .attr('cx', d => xScatter(d[xColScatter]))
    .attr('cy', d => yScatter(d[yColScatter]))
    .attr('r', 6)
    .attr('fill', '#69b3a2')
    .on('mouseover', function(event, d) {
      d3.select(this).attr('fill', 'orange');
      scatterTooltip.style('visibility', 'visible')
        .html(
          `<b>${d[columnState]}</b><br>` +
          `${xColScatter}: ${d[xColScatter]}%<br>` +
          `${yColScatter}: ${d[yColScatter]}%`
        );
    })
    .on('mousemove', event => {
      scatterTooltip.style('top', (event.pageY - 40) + 'px')
                    .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', function() {
      d3.select(this).attr('fill', '#69b3a2');
      scatterTooltip.style('visibility', 'hidden');
    });

  // Trend line
  const xVals = data.map(d => d[xColScatter]);
  const yVals = data.map(d => d[yColScatter]);
  const xMean = d3.mean(xVals);
  const yMean = d3.mean(yVals);
  const slope = d3.sum(xVals.map((x,i) => (x - xMean)*(yVals[i]-yMean))) /
                d3.sum(xVals.map(x => Math.pow(x-xMean,2)));
  const intercept = yMean - slope*xMean;

  scatterSvg.append('line')
    .attr('x1', xScatter(d3.min(xVals)))
    .attr('y1', yScatter(slope*d3.min(xVals)+intercept))
    .attr('x2', xScatter(d3.max(xVals)))
    .attr('y2', yScatter(slope*d3.max(xVals)+intercept))
    .attr('stroke', 'red')
    .attr('stroke-width', 2);
});
//   // -------------------- BUBBLE PLOT -------------------- //
//   const bubbleMargin = { top: 50, right: 40, bottom: 60, left: 70 },
//         bubbleWidth = 800 - bubbleMargin.left - bubbleMargin.right,
//         bubbleHeight = 500 - bubbleMargin.top - bubbleMargin.bottom;

//   const bubbleSvg = d3.select('#bubble-plot')
//     .append('svg')
//     .attr('width', bubbleWidth + bubbleMargin.left + bubbleMargin.right)
//     .attr('height', bubbleHeight + bubbleMargin.top + bubbleMargin.bottom)
//     .call(d3.zoom()
//       .scaleExtent([0.5, 10])
//       .translateExtent([[0, 0], [bubbleWidth, bubbleHeight]])
//       .on('zoom', zoomed))
//     .append('g')
//     .attr('transform', `translate(${bubbleMargin.left},${bubbleMargin.top})`);

//   const xColBubble = 'Reported public expenditures for abortions (in 000s of dollars), state, 2015';
//   const yColBubble = 'No. of abortion clinics, 2020';
//   const sizeColBubble = '% of residents obtaining abortions who traveled out of state for care, 2020';

//   const xBubble = d3.scaleLinear()
//     .domain([0, d3.max(data, d => +d[xColBubble] || 0) * 1.1])
//     .range([0, bubbleWidth]);

//   const yBubble = d3.scaleLinear()
//     .domain([0, d3.max(data, d => +d[yColBubble] || 0) * 1.1])
//     .range([bubbleHeight, 0]);

//   const sizeBubble = d3.scaleSqrt()
//     .domain([0, d3.max(data, d => +d[sizeColBubble] || 0)])
//     .range([5, 25]);

//   // Axes
//   const xAxisGroup = bubbleSvg.append('g')
//     .attr('transform', `translate(0,${bubbleHeight})`)
//     .call(d3.axisBottom(xBubble));

//   const yAxisGroup = bubbleSvg.append('g')
//     .call(d3.axisLeft(yBubble));

//   // Tooltip
//   const bubbleTooltip = d3.select('body')
//     .append('div')
//     .attr('class', 'tooltip')
//     .style('position', 'absolute')
//     .style('visibility', 'hidden')
//     .style('background', '#fff')
//     .style('padding', '8px')
//     .style('border', '1px solid #ccc')
//     .style('border-radius', '4px');
// });
// //   // Bubbles
// //   const bubbles = bubbleSvg.selectAll('circle')
// //     .data(data)
// //     .enter()
// //     .append('circle')
// //     .attr('cx', d => xBubble(+d[xColBubble] || 0))
// //     .attr('cy', d => yBubble(+d[yColBubble] || 0))
// //     .attr('r', d => sizeBubble(+d[sizeColBubble] || 0))
// //     .attr('fill', '#ff7f0e')
// //     .attr('opacity', 0.7)
// //     .on('mouseover', function(event, d) {
// //       d3.select(this).attr('stroke', 'black').attr('stroke-width', 2);
// //       bubbleTooltip.style('visibility', 'visible')
// //         .html(`<b>${d[columnState]}</b><br>` +
// //               `${xColBubble}: $${d[xColBubble]}k<br>` +
// //               `${yColBubble}: ${d[yColBubble]} clinics<br>` +
// //               `${sizeColBubble}: ${d[sizeColBubble]}%`);
// //     })
// //     .on('mousemove', event => {
// //       bubbleTooltip.style('top', (event.pageY - 40) + 'px')
// //                    .style('left', (event.pageX + 10) + 'px');
// //     })
// //     .on('mouseout', function() {
// //       d3.select(this).attr('stroke', 'none');
// //       bubbleTooltip.style('visibility', 'hidden');
// //     });

// //   // Zoom function
// //   function zoomed(event) {
// //     const newX = event.transform.rescaleX(xBubble);
// //     const newY = event.transform.rescaleY(yBubble);
// //     xAxisGroup.call(d3.axisBottom(newX));
// //     yAxisGroup.call(d3.axisLeft(newY));
// //     bubbles.attr('cx', d => newX(+d[xColBubble] || 0))
// //            .attr('cy', d => newY(+d[yColBubble] || 0));
// //   }

// // });
