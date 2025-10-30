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

const columnState = "U.S. State";

async function loadAbortionData() {
  try {
    const response = await fetch('GuttmacherInstituteAbortionDataByState.xlsx');
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(sheet);
  } catch (error) {
    console.error('Error loading abortion data:', error);
  }
}

loadAbortionData().then(data => {

// -------------------- DIVERGENT HORIZONTAL BAR CHART -------------------- //
const barMargin = { top: 100, right: 50, bottom: 50, left: 200 }, // more top space for legend
      barWidth = 900 - barMargin.left - barMargin.right,
      barHeight = 600 - barMargin.top - barMargin.bottom;

const negativeCol = '% of women aged 15-44 living in a county without a clinic, 2020';
const positiveCol = '% of residents obtaining abortions who traveled out of state for care, 2020';

const barSvg = d3.select('#bar-chart')
  .append('svg')
  .attr('width', barWidth + barMargin.left + barMargin.right)
  .attr('height', barHeight + barMargin.top + barMargin.bottom)
  .append('g')
  .attr('transform', `translate(${barMargin.left},${barMargin.top})`);

// Horizontal scale (X)
const xMax = d3.max(data, d => Math.max(+d[negativeCol] || 0, +d[positiveCol] || 0));
const xBar = d3.scaleLinear()
  .domain([-xMax * 1.1, xMax * 1.1])
  .range([0, barWidth]);

  // Sort data by positiveCol (Out-of-State Travel) ascending
data.sort((a, b) => (+a[positiveCol] || 0) - (+b[positiveCol] || 0));

// Then define y scale after sorting
const yBar = d3.scaleBand()
  .domain(data.map(d => d[columnState])) // now sorted
  .range([0, barHeight])
  .padding(0.2);

// Draw X-axis at zero
barSvg.append('g')
  .attr('transform', `translate(0,0)`)
  .call(d3.axisTop(xBar).ticks(5).tickFormat(d => Math.abs(d) + '%'));

// Draw Y-axis (States)
barSvg.append('g')
  .call(d3.axisLeft(yBar));

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

// Negative bars (left)
barSvg.selectAll('.negative-bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'negative-bar')
  .attr('y', d => yBar(d[columnState]))
  .attr('x', d => xBar(-(+d[negativeCol] || 0)))
  .attr('width', d => xBar(0) - xBar(-(+d[negativeCol] || 0)))
  .attr('height', yBar.bandwidth())
  .attr('fill', '#d95f02')
  .on('mouseover', function(event, d) {
    d3.select(this).attr('opacity', 0.8);
    barTooltip.style('visibility', 'visible')
      .html(`${d[negativeCol]}%`);
  })
  .on('mousemove', event => {
    barTooltip.style('top', (event.pageY - 40) + 'px')
              .style('left', (event.pageX + 10) + 'px');
  })
  .on('mouseout', function() {
    d3.select(this).attr('opacity', 1);
    barTooltip.style('visibility', 'hidden');
  });

// Positive bars (right)
barSvg.selectAll('.positive-bar')
  .data(data)
  .enter()
  .append('rect')
  .attr('class', 'positive-bar')
  .attr('y', d => yBar(d[columnState]))
  .attr('x', xBar(0))
  .attr('width', d => xBar(+d[positiveCol] || 0) - xBar(0))
  .attr('height', yBar.bandwidth())
  .attr('fill', '#1b9e77')
  .on('mouseover', function(event, d) {
    d3.select(this).attr('opacity', 0.8);
    barTooltip.style('visibility', 'visible')
      .html(`${d[positiveCol]}%`);
  })
  .on('mousemove', event => {
    barTooltip.style('top', (event.pageY - 40) + 'px')
              .style('left', (event.pageX + 10) + 'px');
  })
  .on('mouseout', function() {
    d3.select(this).attr('opacity', 1);
    barTooltip.style('visibility', 'hidden');
  });

// Chart title
barSvg.append('text')
  .attr('x', barWidth / 2)
  .attr('y', -50)
  .attr('text-anchor', 'middle')
  .attr('font-size', '18px')
  .text('Local Clinic Access vs Out-of-State Travel by State');

// Legend (above plot)
const legend = barSvg.append('g')
  .attr('transform', `translate(0, -80)`);

legend.append('rect').attr('x', 0).attr('y', 40).attr('width', 15).attr('height', 15).attr('fill', '#d95f02');
legend.append('text').attr('x', 20).attr('y', 50).text('% Women in counties without a clinic');

legend.append('rect').attr('x', 300).attr('y', 40).attr('width', 15).attr('height', 15).attr('fill', '#1b9e77');
legend.append('text').attr('x', 320).attr('y', 50).text('% Residents traveling out of state');


  // -------------------- SCATTER PLOT -------------------- //
  const scatterMargin = { top: 50, right: 50, bottom: 60, left: 80 },
        scatterWidth = 700,
        scatterHeight = 400;

  const xCol = '% of counties without a known clinic, 2020';
  const yCol = '% of residents obtaining abortions who traveled out of state for care, 2020';

  const scatterSvg = d3.select('#scatter-plot')
    .append('svg')
    .attr('width', scatterWidth + scatterMargin.left + scatterMargin.right)
    .attr('height', scatterHeight + scatterMargin.top + scatterMargin.bottom)
    .append('g')
    .attr('transform', `translate(${scatterMargin.left},${scatterMargin.top})`);

  const xScatter = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[xCol])])
    .range([0, scatterWidth]);

  const yScatter = d3.scaleLinear()
    .domain([0, d3.max(data, d => d[yCol])])
    .range([scatterHeight, 0]);

  scatterSvg.append('g')
    .attr('transform', `translate(0,${scatterHeight})`)
    .call(d3.axisBottom(xScatter).ticks(10).tickFormat(d => d + '%'));
  scatterSvg.append('g')
    .call(d3.axisLeft(yScatter).ticks(10).tickFormat(d => d + '%'));

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

  scatterSvg.selectAll('.point')
    .data(data)
    .enter()
    .append('circle')
    .attr('class','point')
    .attr('cx', d => xScatter(d[xCol]))
    .attr('cy', d => yScatter(d[yCol]))
    .attr('r', 6)
    .attr('fill', '#69b3a2')
    .on('mouseover', (event,d) => {
      d3.select(event.currentTarget).attr('fill','orange');
      scatterTooltip.style('visibility','visible')
        .html(`<b>${d[columnState]}</b><br>${xCol}: ${d[xCol]}%<br>${yCol}: ${d[yCol]}%`);
    })
    .on('mousemove', event => {
      scatterTooltip.style('top', (event.pageY - 40) + 'px')
                    .style('left', (event.pageX + 10) + 'px');
    })
    .on('mouseout', event => {
      d3.select(event.currentTarget).attr('fill','#69b3a2');
      scatterTooltip.style('visibility','hidden');
    });

  // Trend line
  const xVals = data.map(d => d[xCol]);
  const yVals = data.map(d => d[yCol]);
  const xMean = d3.mean(xVals);
  const yMean = d3.mean(yVals);
  const slope = d3.sum(xVals.map((x,i)=> (x-xMean)*(yVals[i]-yMean))) / d3.sum(xVals.map(x => Math.pow(x-xMean,2)));
  const intercept = yMean - slope*xMean;

  scatterSvg.append('line')
    .attr('x1', xScatter(d3.min(xVals)))
    .attr('y1', yScatter(slope*d3.min(xVals)+intercept))
    .attr('x2', xScatter(d3.max(xVals)))
    .attr('y2', yScatter(slope*d3.max(xVals)+intercept))
    .attr('stroke', 'red')
    .attr('stroke-width', 2);
// After drawing axes
scatterSvg.append('g')
  .attr('transform', `translate(0,${scatterHeight})`)
  .call(d3.axisBottom(xScatter).ticks(10).tickFormat(d => d + '%'));

scatterSvg.append('g')
  .call(d3.axisLeft(yScatter).ticks(10).tickFormat(d => d + '%'));

// === Add axis labels ===
scatterSvg.append('text')
  .attr('class', 'x label')
  .attr('x', scatterWidth / 2)
  .attr('y', scatterHeight + 45)
  .attr('text-anchor', 'middle')
  .attr('font-size', '13px')
  .text('% of Counties Without a Clinic (2020)');

scatterSvg.append('text')
  .attr('class', 'y label')
  .attr('x', -scatterHeight / 2)
  .attr('y', -55)
  .attr('transform', 'rotate(-90)')
  .attr('text-anchor', 'middle')
  .attr('font-size', '13px')
  .text('% of Residents Traveling Out of State (2020)');

// === Add chart title ===
scatterSvg.append('text')
  .attr('x', scatterWidth / 2)
  .attr('y', -20)
  .attr('text-anchor', 'middle')
  .attr('font-size', '18px')
  .attr('font-weight', 'bold')
  .text('Out-of-State Travel vs Local Clinic Scarcity by State');

// === Add subtitle (optional, clarifies dots = states) ===
scatterSvg.append('text')
  .attr('x', scatterWidth / 2)
  .attr('y', 0)
  .attr('text-anchor', 'middle')
  .attr('font-size', '12px')
  .attr('fill', 'gray')
  .text('Each circle represents one U.S. state');

});
