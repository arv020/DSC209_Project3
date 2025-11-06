// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
// import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';

// const columnState = "U.S. State";

// async function loadAbortionData() {
//   try {
//     const response = await fetch('GuttmacherInstituteAbortionDataByState.xlsx');
//     const arrayBuffer = await response.arrayBuffer();
//     const workbook = XLSX.read(arrayBuffer, { type: 'array' });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     return XLSX.utils.sheet_to_json(sheet);
//   } catch (error) {
//     console.error('Error loading abortion data:', error);
//   }
// }

// loadAbortionData().then(data => {

//   console.log("Loaded columns:", Object.keys(data[0]));


// // -------------------- DIVERGENT HORIZONTAL BAR CHART -------------------- //
// const barMargin = { top: 100, right: 50, bottom: 50, left: 200 }, // more top space for legend
//       barWidth = 900 - barMargin.left - barMargin.right,
//       barHeight = 600 - barMargin.top - barMargin.bottom;

// const negativeCol = '% of women aged 15-44 living in a county without a clinic, 2020';
// const positiveCol = '% of residents obtaining abortions who traveled out of state for care, 2020';

// const barSvg = d3.select('#bar-chart')
//   .append('svg')
//   .attr('width', barWidth + barMargin.left + barMargin.right)
//   .attr('height', barHeight + barMargin.top + barMargin.bottom)
//   .append('g')
//   .attr('transform', `translate(${barMargin.left},${barMargin.top})`);

// // Horizontal scale (X)
// const xMax = d3.max(data, d => Math.max(+d[negativeCol] || 0, +d[positiveCol] || 0));
// const xBar = d3.scaleLinear()
//   .domain([-xMax * 1.1, xMax * 1.1])
//   .range([0, barWidth]);

//   // Sort data by positiveCol (Out-of-State Travel) ascending
// data.sort((a, b) => (+a[positiveCol] || 0) - (+b[positiveCol] || 0));

// // Then define y scale after sorting
// const yBar = d3.scaleBand()
//   .domain(data.map(d => d[columnState])) // now sorted
//   .range([0, barHeight])
//   .padding(0.2);

// // Draw X-axis at zero
// barSvg.append('g')
//   .attr('transform', `translate(0,0)`)
//   .call(d3.axisTop(xBar).ticks(5).tickFormat(d => Math.abs(d) + '%'));

// // Draw Y-axis (States)
// barSvg.append('g')
//   .call(d3.axisLeft(yBar));

// // Tooltip
// const barTooltip = d3.select('body')
//   .append('div')
//   .attr('class', 'tooltip')
//   .style('position', 'absolute')
//   .style('visibility', 'hidden')
//   .style('background', '#fff')
//   .style('padding', '8px')
//   .style('border', '1px solid #ccc')
//   .style('border-radius', '4px')
//   .style('font-size', '13px');

// // Negative bars (left)
// barSvg.selectAll('.negative-bar')
//   .data(data)
//   .enter()
//   .append('rect')
//   .attr('class', 'negative-bar')
//   .attr('y', d => yBar(d[columnState]))
//   .attr('x', d => xBar(-(+d[negativeCol] || 0)))
//   .attr('width', d => xBar(0) - xBar(-(+d[negativeCol] || 0)))
//   .attr('height', yBar.bandwidth())
//   .attr('fill', '#d95f02')
//   .on('mouseover', function(event, d) {
//     d3.select(this).attr('opacity', 0.8);
//     barTooltip.style('visibility', 'visible')
//       .html(`${d[negativeCol]}%`);
//   })
//   .on('mousemove', event => {
//     barTooltip.style('top', (event.pageY - 40) + 'px')
//               .style('left', (event.pageX + 10) + 'px');
//   })
//   .on('mouseout', function() {
//     d3.select(this).attr('opacity', 1);
//     barTooltip.style('visibility', 'hidden');
//   });

// // Positive bars (right)
// barSvg.selectAll('.positive-bar')
//   .data(data)
//   .enter()
//   .append('rect')
//   .attr('class', 'positive-bar')
//   .attr('y', d => yBar(d[columnState]))
//   .attr('x', xBar(0))
//   .attr('width', d => xBar(+d[positiveCol] || 0) - xBar(0))
//   .attr('height', yBar.bandwidth())
//   .attr('fill', '#1b9e77')
//   .on('mouseover', function(event, d) {
//     d3.select(this).attr('opacity', 0.8);
//     barTooltip.style('visibility', 'visible')
//       .html(`${d[positiveCol]}%`);
//   })
//   .on('mousemove', event => {
//     barTooltip.style('top', (event.pageY - 40) + 'px')
//               .style('left', (event.pageX + 10) + 'px');
//   })
//   .on('mouseout', function() {
//     d3.select(this).attr('opacity', 1);
//     barTooltip.style('visibility', 'hidden');
//   });

// // Chart title
// barSvg.append('text')
//   .attr('x', barWidth / 2)
//   .attr('y', -50)
//   .attr('text-anchor', 'middle')
//   .attr('font-size', '18px')
//   .text('Local Clinic Access vs Out-of-State Travel by State');

// // Legend (above plot)
// const legend = barSvg.append('g')
//   .attr('transform', `translate(0, -80)`);

// legend.append('rect').attr('x', 0).attr('y', 40).attr('width', 15).attr('height', 15).attr('fill', '#d95f02');
// legend.append('text').attr('x', 20).attr('y', 50).text('% Women in counties without a clinic');

// legend.append('rect').attr('x', 300).attr('y', 40).attr('width', 15).attr('height', 15).attr('fill', '#1b9e77');
// legend.append('text').attr('x', 320).attr('y', 50).text('% Residents traveling out of state');

// });

// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
// import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';

// const columnState = "U.S. State";
// const negativeCol = "% of women aged 15-44 living in a county without a clinic, 2020";
// const positiveCol = "% of residents obtaining abortions who traveled out of state for care, 2020";

// async function loadAbortionData() {
//   try {
//     const response = await fetch('GuttmacherInstituteAbortionDataByState.xlsx');
//     const arrayBuffer = await response.arrayBuffer();
//     const workbook = XLSX.read(arrayBuffer, { type: 'array' });
//     const sheetName = workbook.SheetNames[0];
//     const sheet = workbook.Sheets[sheetName];
//     return XLSX.utils.sheet_to_json(sheet);
//   } catch (error) {
//     console.error('Error loading abortion data:', error);
//   }
// }

// loadAbortionData().then(data => {
//   console.log("Loaded columns:", Object.keys(data[0]));

//   // --- CONFIG --- //
//   const margin = { top: 100, right: 50, bottom: 50, left: 200 };
//   const width = 900 - margin.left - margin.right;
//   const height = 600 - margin.top - margin.bottom;

//   // Removing DC
//   data = data.filter(d => d[columnState] !== "District of Columbia");
//   // Define regions (customize as needed)
//   const regions = {
//     "West": ["California","Oregon","Washington","Nevada","Arizona","Utah","Colorado","Idaho","Montana","Hawaii","Alaska"],
//     "Midwest": ["Illinois","Indiana","Iowa","Kansas","Michigan","Minnesota","Missouri","Nebraska","North Dakota","Ohio","South Dakota","Wisconsin"],
//     "South": ["Alabama","Arkansas","Delaware","Florida","Georgia","Kentucky","Louisiana","Maryland","Mississippi","North Carolina","Oklahoma","South Carolina","Tennessee","Texas","Virginia","West Virginia"],
//     "Northeast": ["Connecticut","Maine","Massachusetts","New Hampshire","New Jersey","New York","Pennsylvania","Rhode Island","Vermont"]
//   };

//   // Add region property to each data row
//   data.forEach(d => {
//     d.Region = Object.keys(regions).find(r => regions[r].includes(d[columnState])) || "Other";
//   });


//   // Sort by positiveCol (descending)
//   data.sort((a, b) => (+b[positiveCol] || 0) - (+a[positiveCol] || 0));

//   // SVG setup
//   const svg = d3.select('#bar-chart')
//     .append('svg')
//     .attr('width', width + margin.left + margin.right)
//     .attr('height', height + margin.top + margin.bottom)
//     .append('g')
//     .attr('transform', `translate(${margin.left},${margin.top})`);

//   // --- SCALES --- //
//   const xMax = d3.max(data, d => Math.max(+d[negativeCol] || 0, +d[positiveCol] || 0));
//   const x = d3.scaleLinear()
//     .domain([-xMax * 1.1, xMax * 1.1])
//     .range([0, width]);

//   const y = d3.scaleBand()
//     .domain(data.map(d => d[columnState]))
//     .range([0, height])
//     .padding(0.2);

//   // --- AXES --- //
// const xAxis = d3.axisBottom(x)
//   .ticks(6)
//   .tickFormat(d => Math.abs(d) + '%');

// svg.append('g')
//   .attr('class', 'x-axis')
//   .attr('transform', `translate(0, ${height})`) // move to bottom
//   .call(xAxis);


//   svg.append('g')
//     .attr('class', 'y-axis')
//     .call(d3.axisLeft(y));

//   // --- ZERO LINE --- //
//   svg.append('line')
//     .attr('x1', x(0))
//     .attr('x2', x(0))
//     .attr('y1', 0)
//     .attr('y2', height)
//     .attr('stroke', '#333')
//     .attr('stroke-width', 1);

//   // --- TOOLTIP --- //
//   const tooltip = d3.select('body')
//     .append('div')
//     .attr('class', 'tooltip')
//     .style('position', 'absolute')
//     .style('visibility', 'hidden')
//     .style('background', '#fff')
//     .style('padding', '8px')
//     .style('border', '1px solid #ccc')
//     .style('border-radius', '4px')
//     .style('font-size', '13px');

//   // --- BARS --- //
//   // Left (negative)
//   svg.selectAll('.negative-bar')
//     .data(data)
//     .enter()
//     .append('rect')
//     .attr('class', 'negative-bar')
//     .attr('y', d => y(d[columnState]))
//     .attr('x', d => x(-(+d[negativeCol] || 0)))
//     .attr('width', d => x(0) - x(-(+d[negativeCol] || 0)))
//     .attr('height', y.bandwidth())
//     .attr('fill', '#d95f02')
//     .on('mouseover', function (event, d) {
//       d3.select(this).attr('opacity', 0.8);
//       tooltip.style('visibility', 'visible')
//         .html(`<strong>${d[columnState]}</strong><br>${negativeCol}: ${d[negativeCol]}%`);
//     })
//     .on('mousemove', event => {
//       tooltip.style('top', (event.pageY - 40) + 'px')
//         .style('left', (event.pageX + 10) + 'px');
//     })
//     .on('mouseout', function () {
//       d3.select(this).attr('opacity', 1);
//       tooltip.style('visibility', 'hidden');
//     });

//   // Right (positive)
//   svg.selectAll('.positive-bar')
//     .data(data)
//     .enter()
//     .append('rect')
//     .attr('class', 'positive-bar')
//     .attr('y', d => y(d[columnState]))
//     .attr('x', x(0))
//     .attr('width', d => x(+d[positiveCol] || 0) - x(0))
//     .attr('height', y.bandwidth())
//     .attr('fill', '#1b9e77')
//     .on('mouseover', function (event, d) {
//       d3.select(this).attr('opacity', 0.8);
//       tooltip.style('visibility', 'visible')
//         .html(`<strong>${d[columnState]}</strong><br>${positiveCol}: ${d[positiveCol]}%`);
//     })
//     .on('mousemove', event => {
//       tooltip.style('top', (event.pageY - 40) + 'px')
//         .style('left', (event.pageX + 10) + 'px');
//     })
//     .on('mouseout', function () {
//       d3.select(this).attr('opacity', 1);
//       tooltip.style('visibility', 'hidden');
//     });

//   // --- TITLES & LEGEND --- //
//   svg.append('text')
//     .attr('x', width / 2)
//     .attr('y', -60)
//     .attr('text-anchor', 'middle')
//     .attr('font-size', '18px')
//     .attr('font-weight', '600')
//     .text('Divergent Bar Chart: Local Clinic Access vs Out-of-State Travel (2020)');

//   // // Legend
//   // const legend = svg.append('g').attr('transform', `translate(${width / 3}, -40)`);

//   // legend.append('rect').attr('x', 0).attr('width', 15).attr('height', 15).attr('fill', '#d95f02');
//   // legend.append('text').attr('x', 22).attr('y', 12).text('Access Gap');

//   // legend.append('rect').attr('x', 250).attr('width', 15).attr('height', 15).attr('fill', '#1b9e77');
//   // legend.append('text').attr('x', 272).attr('y', 12).text('% Residents Traveling Out of State');


// // --- LEGEND (top-right, stacked) --- //
// const legend = svg.append('g')
//   .attr('class', 'legend')
//   .attr('transform', `translate(${width - 180}, -40)`); // top-right offset

// const legendData = [
//   { color: '#d95f02', text: 'Access Gap' },
//   { color: '#1b9e77', text: '% Residents Traveling Out of State' }
// ];

// // Stack vertically
// legend.selectAll('g')
//   .data(legendData)
//   .enter()
//   .append('g')
//   .attr('transform', (d, i) => `translate(0, ${i * 25})`) // 25px spacing between items
//   .each(function(d) {
//     const g = d3.select(this);
//     g.append('rect')
//       .attr('width', 15)
//       .attr('height', 15)
//       .attr('fill', d.color);
    
//     g.append('text')
//       .attr('x', 22)
//       .attr('y', 12)
//       .attr('font-size', '13px')
//       .text(d.text);
//   });


//   // --- LABELS (optional) --- //
//   svg.selectAll('.value-label-left')
//     .data(data)
//     .enter()
//     .append('text')
//     .attr('x', d => x(-(+d[negativeCol] || 0)) - 5)
//     .attr('y', d => y(d[columnState]) + y.bandwidth() / 2 + 4)
//     .attr('text-anchor', 'end')
//     .attr('font-size', '11px')
//     .text(d => d[negativeCol] ? d[negativeCol] + '%' : '');

//   svg.selectAll('.value-label-right')
//     .data(data)
//     .enter()
//     .append('text')
//     .attr('x', d => x(+d[positiveCol] || 0) + 5)
//     .attr('y', d => y(d[columnState]) + y.bandwidth() / 2 + 4)
//     .attr('text-anchor', 'start')
//     .attr('font-size', '11px')
//     .text(d => d[positiveCol] ? d[positiveCol] + '%' : '');
// }
// );

import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import * as XLSX from 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/+esm';

const columnState = "U.S. State";
const negativeCol = "% of women aged 15-44 living in a county without a clinic, 2020";
const positiveCol = "% of residents obtaining abortions who traveled out of state for care, 2020";

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
  // Remove DC
  data = data.filter(d => d[columnState] !== "District of Columbia");

  // Define regions
  const regions = {
    "West": ["California","Oregon","Washington","Nevada","Arizona","Utah","Colorado","Idaho","Montana","Hawaii","Alaska", "Wyoming", "New Mexico"],
    "Midwest": ["Illinois","Indiana","Iowa","Kansas","Michigan","Minnesota","Missouri","Nebraska","North Dakota","Ohio","South Dakota","Wisconsin"],
    "South": ["Alabama","Arkansas","Delaware","Florida","Georgia","Kentucky","Louisiana","Maryland","Mississippi","North Carolina","Oklahoma","South Carolina","Tennessee","Texas","Virginia","West Virginia"],
    "Northeast": ["Connecticut","Maine","Massachusetts","New Hampshire","New Jersey","New York","Pennsylvania","Rhode Island","Vermont"]
  };

  data.forEach(d => {
    d.Region = Object.keys(regions).find(r => regions[r].includes(d[columnState])) || "Other";
  });

  // --- CONFIG --- //
  const margin = { top: 100, right: 50, bottom: 50, left: 200 };
  const width = 900 - margin.left - margin.right;
  const height = 600 - margin.top - margin.bottom;

  // SVG setup
  const svg = d3.select('#bar-chart')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // --- SCALES --- //
  const xMax = d3.max(data, d => Math.max(+d[negativeCol] || 0, +d[positiveCol] || 0));
  const x = d3.scaleLinear()
    .domain([-xMax * 1.1, xMax * 1.2])
    .range([0, width]);

  const y = d3.scaleBand()
    .range([0, height])
    .padding(0.2);

  // --- AXES --- //
  svg.append('g').attr('class', 'x-axis')
    .attr('transform', `translate(0, ${height})`);

  svg.append('g').attr('class', 'y-axis');

  // --- ZERO LINE --- //
  svg.append('line')
    .attr('x1', x(0))
    .attr('x2', x(0))
    .attr('y1', 0)
    .attr('y2', height)
    .attr('stroke', '#333')
    .attr('stroke-width', 1);

  // --HELPERS--//  
  const fmtPct = d3.format(".0f");
  let showAccess = true;  
  let showTravel = true;

   // --- TOOLTIP --- //
  const tooltip = d3.select('body')
    .append('div')
    .attr('class', 'tooltip')
    .style('position', 'absolute')
    .style('visibility', 'hidden')
    .style('background', '#fff')
    .style('padding', '10px 12px')
    .style('border', '1px solid #ddd')
    .style('border-radius', '6px')
    .style('box-shadow', '0 2px 8px rgba(0,0,0,.08)')
    .style('font', '12px/1.3 system-ui');

  // --- LEGEND --- //
  const legend = svg.append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${width - 240}, -60)`);

legend.append('text')
  .attr('x', 0)
  .attr('y', -8)
  .style('font-weight', 600)
  .style('font-size', '12px')
  .text('Series');

const legendItems = [
  { key: 'access',  color: '#d95f02', label: 'Access Gap' },
  { key: 'travel',  color: '#1b9e77', label: '% Residents Traveling Out of State' }
];

const li = legend.selectAll('.legend-item')
  .data(legendItems)
  .enter()
  .append('g')
  .attr('class', 'legend-item')
  .attr('transform', (d,i) => `translate(0, ${i*22})`)
  .style('cursor', 'pointer')
  .on('click', (_, d) => {
    if (d.key === 'access') showAccess = !showAccess;
    if (d.key === 'travel') showTravel = !showTravel;
    updateChart();       
    renderLegend();     
  });

li.append('rect')
  .attr('width', 14).attr('height', 14)
  .attr('rx', 2).attr('ry', 2)
  .attr('fill', d => d.color);

li.append('text')
  .attr('x', 20).attr('y', 11)
  .style('font-size', '12px')
  .text(d => d.label);

// SMALL HELPER FUNCTION TO DIN A SERIES WHEN ITS HDDEN
function renderLegend(){
  li.selectAll('rect').attr('opacity', d => {
    if (d.key === 'access') return showAccess ? 1 : 0.25;
    if (d.key === 'travel') return showTravel ? 1 : 0.25;
  });
  li.selectAll('text').style('opacity', d => {
    if (d.key === 'access') return showAccess ? 1 : 0.5;
    if (d.key === 'travel') return showTravel ? 1 : 0.5;
  });
}
renderLegend();

  // --- LABELS --- //
  const addLabels = filteredData => {
    svg.selectAll('.value-label-left').remove();
    svg.selectAll('.value-label-right').remove();

    svg.selectAll('.value-label-left')
      .data(filteredData)
      .enter()
      .append('text')
      .attr('class', 'value-label-left')
      .attr('x', d => x(-(+d[negativeCol] || 0)) - 5)
      .attr('y', d => y(d[columnState]) + y.bandwidth() / 2 + 4)
      .attr('text-anchor', 'end')
      .attr('font-size', '11px')
      .text(d => d[negativeCol] ? d[negativeCol] + '%' : '');

    svg.selectAll('.value-label-right')
      .data(filteredData)
      .enter()
      .append('text')
      .attr('class', 'value-label-right')
      .attr('x', d => x(+d[positiveCol] || 0) + 5)
      .attr('y', d => y(d[columnState]) + y.bandwidth() / 2 + 4)
      .attr('text-anchor', 'start')
      .attr('font-size', '11px')
      .text(d => d[positiveCol] ? d[positiveCol] + '%' : '');
  };

  // --- UPDATE FUNCTION --- //
  function updateChart() {
    let selectedRegion = d3.select('#region-select').node().value;
    let sortOption = d3.select('#sort-select').node().value;
    let topN = d3.select('#topn-select').node().value;

    let filteredData = selectedRegion === "All" ? data : data.filter(d => d.Region === selectedRegion);

    // Sort
    switch(sortOption){
      case 'positive-desc':
        filteredData.sort((a,b) => (+b[positiveCol] || 0) - (+a[positiveCol] || 0));
        break;
      case 'positive-asc':
        filteredData.sort((a,b) => (+a[positiveCol] || 0) - (+b[positiveCol] || 0));
        break;
      case 'negative-desc':
        filteredData.sort((a,b) => (+b[negativeCol] || 0) - (+a[negativeCol] || 0));
        break;
      case 'negative-asc':
        filteredData.sort((a,b) => (+a[negativeCol] || 0) - (+b[negativeCol] || 0));
        break;
    }

    if(topN !== "All") filteredData = filteredData.slice(0, +topN);

    // Update y-scale
    y.domain(filteredData.map(d => d[columnState]));

    // Update y-axis
    svg.select('.y-axis')
      .transition().duration(500)
      .call(d3.axisLeft(y));

    // Update x-axis (optional if dynamic)
    svg.select('.x-axis')
      .transition().duration(500)
      .call(d3.axisBottom(x).ticks(6).tickFormat(d => `${Math.abs(d)}%`));

    // --- BARS (negative) ---
    const negBars = svg.selectAll('.negative-bar')
  .data(filteredData, d => d[columnState]);

negBars.join(
  enter => enter.append('rect')
    .attr('class', 'negative-bar')
    .attr('y', d => y(d[columnState]))
    .attr('x', d => x(-(+d[negativeCol] || 0)))
    .attr('width', d => x(0) - x(-(+d[negativeCol] || 0)))
    .attr('height', y.bandwidth())
    .attr('fill', '#d95f02')
    .on('mouseenter', (event, d) => {
      tooltip
        .html(
          `<div style="font-weight:600;margin-bottom:4px">${d[columnState]}</div>
           <div><span style="color:#d95f02">Access Gap:</span> ${fmtPct(+d[negativeCol])}%</div>
           <div><span style="color:#1b9e77">Travel out of state:</span> ${fmtPct(+d[positiveCol])}%</div>`
        )
        .style('visibility', 'visible');
    })
    .on('mousemove', (event) => {
      tooltip.style('top', (event.pageY + 14) + 'px')
             .style('left', (event.pageX + 16) + 'px');
    })
    .on('mouseleave', () => tooltip.style('visibility', 'hidden')),
  update => update
    .transition().duration(500)
    .attr('y', d => y(d[columnState]))
    .attr('x', d => x(-(+d[negativeCol] || 0)))
    .attr('width', d => x(0) - x(-(+d[negativeCol] || 0)))
    .attr('height', y.bandwidth()),
  exit => exit.remove()
)
.attr('display', showAccess ? null : 'none');

    // --- BARS (positive) ---
    const posBars = svg.selectAll('.positive-bar')
  .data(filteredData, d => d[columnState]);

posBars.join(
  enter => enter.append('rect')
    .attr('class', 'positive-bar')
    .attr('y', d => y(d[columnState]))
    .attr('x', x(0))
    .attr('width', d => x(+d[positiveCol] || 0) - x(0))
    .attr('height', y.bandwidth())
    .attr('fill', '#1b9e77')
    .on('mouseenter', (event, d) => {
      tooltip
        .html(
          `<div style="font-weight:600;margin-bottom:4px">${d[columnState]}</div>
           <div><span style="color:#1b9e77">Travel out of state:</span> ${fmtPct(+d[positiveCol])}%</div>
           <div><span style="color:#d95f02">Access Gap:</span> ${fmtPct(+d[negativeCol])}%</div>`
        )
        .style('visibility', 'visible');
    })
    .on('mousemove', (event) => {
      tooltip.style('top', (event.pageY + 14) + 'px')
             .style('left', (event.pageX + 16) + 'px');
    })
    .on('mouseleave', () => tooltip.style('visibility', 'hidden')),
  update => update
    .transition().duration(500)
    .attr('y', d => y(d[columnState]))
    .attr('x', x(0))
    .attr('width', d => x(+d[positiveCol] || 0) - x(0))
    .attr('height', y.bandwidth()),
  exit => exit.remove()
)
.attr('display', showTravel ? null : 'none');

    // // Update labels
    // addLabels(filteredData);
    // renderStats(filteredData);
    
    // -- Update labels
    addLabels(filteredData);

    // keep label visibility in sync with the legend/series toggles
    const root = d3.select('#bar-chart svg');   // if you already have `svg` in scope, use that instead
    root.selectAll('.value-label-left')   .attr('display', showAccess ? null : 'none');  // Access Gap labels
    root.selectAll('.value-label-right')  .attr('display', showTravel ? null : 'none');  // Travel % labels

    // update the stats table
    renderStats(filteredData);
  }

  function renderStats(filteredData) {
  // GROUPED REGIONS
  const regions = d3.rollups(
    filteredData,
    v => ({
      numStates: v.length,
      avgAccessGap: d3.mean(v, d => +d[negativeCol]),
      maxAccessGap: d3.max(v, d => +d[negativeCol]),
      avgTravel: d3.mean(v, d => +d[positiveCol]),
      maxTravel: d3.max(v, d => +d[positiveCol])
    }),
    d => d.Region
  );

  //TABLES
  const container = d3.select('#stats-grid');
  container.html(''); 

  const table = container.append('table')
    .style('border-collapse', 'collapse')
    .style('width', '100%');

  const thead = table.append('thead');
  const tbody = table.append('tbody');

  // TABLE HEADERS
  const headers = ['Region', 'Number of States', 'Avg Access Gap', 'Max Access Gap', 'Avg Travel', 'Max Travel'];
  thead.append('tr')
    .selectAll('th')
    .data(headers)
    .enter()
    .append('th')
    .text(d => d)
    .style('border', '1px solid #ccc')
    .style('padding', '6px')
    .style('text-align', 'center')
    .style('background-color', '#f2f2f2');

  // COLOR SCALES FOR HEATMAP
  const accessValues = filteredData.map(d => +d[negativeCol]);
  const travelValues = filteredData.map(d => +d[positiveCol]);

  const accessScale = d3.scaleLinear()
    .domain([d3.min(accessValues), d3.max(accessValues)])
    .range(['#fff5f0', '#d95f02']); 

  const travelScale = d3.scaleLinear()
    .domain([d3.min(travelValues), d3.max(travelValues)])
    .range(['#f7fcf5', '#1b9e77']); 

  // TABLE ROWS
  const rows = tbody.selectAll('tr')
    .data(regions)
    .enter()
    .append('tr');

  rows.selectAll('td')
    .data(d => [
      { value: d[0], type: 'region' },
      { value: d[1].numStates, type: 'numStates' }, 
      { value: d[1].avgAccessGap.toFixed(1) + '%', type: 'access', raw: d[1].avgAccessGap },
      { value: d[1].maxAccessGap + '%', type: 'access', raw: d[1].maxAccessGap },
      { value: d[1].avgTravel.toFixed(1) + '%', type: 'travel', raw: d[1].avgTravel },
      { value: d[1].maxTravel + '%', type: 'travel', raw: d[1].maxTravel }
    ])
    .enter()
    .append('td')
    .text(d => d.value)
    .style('border', '1px solid #ccc')
    .style('padding', '6px')
    .style('text-align', 'center')
    .style('background-color', d => {
      if(d.type === 'access') return accessScale(d.raw);
      if(d.type === 'travel') return travelScale(d.raw);
      return null; 
    })
    .style('color', d => {
      if(d.type === 'access') return d.raw > d3.mean(accessValues) ? '#fff' : '#000';
      if(d.type === 'travel') return d.raw > d3.mean(travelValues) ? '#fff' : '#000';
      return '#000';
    });
}
  // --- EVENT LISTENERS ---
  d3.selectAll('#region-select, #sort-select, #topn-select').on('change', updateChart);

  // --- INITIAL DRAW ---
  updateChart();

});


// ---------- HOVER FOCUS + MUTE (adds-only, works across updates) ----------
(function focusMute() {
  const stateKey = "U.S. State"; // uses your existing columnState

  function bind() {
    const root = d3.select('#bar-chart svg');
    if (root.empty()) return;

    const bars = root.selectAll('.positive-bar, .negative-bar');

    bars
      .on('mouseenter.focusmute', function (event, d) {
        const st = d && d[stateKey];
        // Dim everything
        root.selectAll('.positive-bar, .negative-bar').classed('dim', true).classed('hi', false);
        root.selectAll('.y-axis .tick text').classed('dim', true).classed('hi', false);

        // Un-dim both bars for this state
        root.selectAll('.positive-bar, .negative-bar')
          .filter(dd => dd && dd[stateKey] === st)
          .classed('dim', false)
          .classed('hi', true);

        // Un-dim the matching y-axis label
        root.selectAll('.y-axis .tick text')
          .filter(t => t === st)
          .classed('dim', false)
          .classed('hi', true);
      })
      .on('mouseleave.focusmute', function () {
        const root = d3.select('#bar-chart svg');
        root.selectAll('.dim').classed('dim', false);
        root.selectAll('.hi').classed('hi', false);
        root.selectAll('.y-axis .tick text').classed('dim', false).classed('hi', false);
      });
  }

  bind();
  const host = document.getElementById('bar-chart');
  if (host) {
    const mo = new MutationObserver(() => bind());
    mo.observe(host, { childList: true, subtree: true });
  }
})();


