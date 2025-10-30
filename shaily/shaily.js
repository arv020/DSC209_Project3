const COLS = {
  state: 'U.S. State',
  rate2020: 'No. of abortions per 1,000 women aged 15–44, by state of occurrence, 2020',
  clinics2020: 'No. of abortion clinics, 2020',
  total2020: 'No. of abortions, by state of occurrence, 2020',
  pctChangeClinics: '% change in the no. of abortion clinics, 2017-2020'
};


function toNum(x) {
  if (x == null) return NaN;
  if (typeof x === 'number') return x;
  const s = String(x).toLowerCase().trim();
  if (!s || s === 'na' || s === 'n/a' || s === 'nr' || s === 'unavailable') return NaN;
  const v = +s.replace(/[,\s<>%]/g, '');
  return Number.isFinite(v) ? v : NaN;
}


d3.csv('../data/abortions_long.csv', d3.autoType).then(raw => {
  if (!raw?.length) {
    d3.select('#chart1').append('p').style('color', '#b91c1c')
      .text('Could not find or load CSV data.');
    return;
  }
  console.log('🔑 Columns:', Object.keys(raw[0]));


  const rows2020 = raw.map(d => ({
    state: d[COLS.state],
    year: 2020, 
    rate: toNum(d[COLS.rate2020]),
    clinics: toNum(d[COLS.clinics2020]),
    total: toNum(d[COLS.total2020])
  })).filter(d =>
    d.state && Number.isFinite(d.rate) && Number.isFinite(d.clinics)
  );

  drawScatter(rows2020);

  const changeClinics = raw.map(d => ({
    state: d[COLS.state],
    pct: toNum(d[COLS.pctChangeClinics])
  })).filter(d => d.state && Number.isFinite(d.pct));

  drawClinicsChange(changeClinics);

}).catch(err => {
  console.error(err);
  d3.select('#chart1').append('p').style('color', '#b91c1c')
    .text('Error loading CSV. See console.');
});

//Chart 1//
function drawScatter(data) {
  const w = 720, h = 440, m = { t: 30, r: 20, b: 48, l: 58 };
  const iw = w - m.l - m.r, ih = h - m.t - m.b;

  const wrap = d3.select('#chart1');
  wrap.selectAll('*').remove();

  const svg = wrap.append('svg').attr('width', w).attr('height', h);
  const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.clinics)).nice()
    .range([0, iw]);

  const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.rate)).nice()
    .range([ih, 0]);

  const r = d3.scaleSqrt()
    .domain(d3.extent(data, d => Number.isFinite(d.total) ? d.total : 1))
    .range([2, 12]);

  g.append('g').attr('transform', `translate(0,${ih})`).call(d3.axisBottom(x));
  g.append('g').call(d3.axisLeft(y));
  g.append('text').attr('x', iw).attr('y', ih + 36).attr('text-anchor', 'end')
    .text('Providers (or per 100k) — using clinics, 2020');
  g.append('text').attr('x', 0).attr('y', -10)
    .text('Abortion rate per 1,000 (2020)');

  const tip = wrap.append('div')
    .style('position','absolute').style('pointer-events','none')
    .style('background','#fff').style('border','1px solid #ccc')
    .style('padding','6px 8px').style('border-radius','6px')
    .style('font','12px system-ui').style('display','none');

  g.selectAll('circle')
    .data(data, d => d.state)
    .join('circle')
    .attr('cx', d => x(d.clinics))
    .attr('cy', d => y(d.rate))
    .attr('r',  d => r(Number.isFinite(d.total) ? d.total : 1))
    .attr('fill', '#8a8a8a')
    .attr('opacity', 0.9)
    .on('mouseenter', (e, d) => {
      tip.style('display','block')
         .html(`<strong>${d.state}</strong> (2020)<br>
                Rate: ${d.rate}<br>
                Clinics: ${d.clinics}${Number.isFinite(d.total) ? `<br>Total abortions: ${d.total}` : ''}`);
    })
    .on('mousemove', (e) => {
      const bb = wrap.node().getBoundingClientRect();
      tip.style('left', (e.clientX - bb.left + 16)+'px')
         .style('top',  (e.clientY - bb.top  - 24)+'px');
    })
    .on('mouseleave', () => tip.style('display','none'));
}

//Chart2//
/* ---------- Chart 2 (horizontal bars: % change in clinics) ---------- */
function drawClinicsChange(data) {
  const w = 950, m = { t: 40, r: 40, b: 40, l: 220 }; // wider + more left space
  const barH = 24;
  const h = m.t + m.b + barH * data.length;

  const root = d3.select('#chart2');
  root.selectAll('*').remove();

  const svg = root.append('svg').attr('width', w).attr('height', h);
  const g = svg.append('g').attr('transform', `translate(${m.l},${m.t})`);
  svg.style('font', '12px system-ui');

  const x = d3.scaleLinear()
    .domain(d3.extent(data, d => d.pct)).nice()
    .range([0, w - m.l - m.r]);

  const y = d3.scaleBand()
    .domain(data.map(d => d.state))
    .range([0, h - m.t - m.b])
    .padding(0.45);

  const color = d3.scaleDiverging()
    .domain([d3.min(data, d => d.pct), 0, d3.max(data, d => d.pct)])
    .interpolator(d3.interpolateRdBu);

  // X-axis
  g.append('g')
    .attr('transform', `translate(0,${h - m.t - m.b})`)
    .call(d3.axisBottom(x).ticks(7).tickFormat(d => `${d}%`));

  // Y-axis with wrapped labels
  g.append('g')
    .call(d3.axisLeft(y))
    .selectAll('text')
    .style('font-size', '11px')
    .call(wrapText, 160); // wrap to fit

  // Zero line
  g.append('line')
    .attr('x1', x(0)).attr('x2', x(0))
    .attr('y1', 0).attr('y2', h - m.t - m.b)
    .attr('stroke', '#999')
    .attr('stroke-dasharray', '4,3');

  const tip = root.append('div')
    .style('position', 'absolute')
    .style('pointer-events', 'none')
    .style('background', '#fff')
    .style('border', '1px solid #ccc')
    .style('padding', '6px 8px')
    .style('border-radius', '6px')
    .style('font', '12px system-ui')
    .style('display', 'none');

  const barsG = g.append('g');

  function renderBars(arr) {
    y.domain(arr.map(d => d.state));
    barsG.selectAll('rect')
      .data(arr, d => d.state)
      .join('rect')
      .attr('x', d => Math.min(x(0), x(d.pct)))
      .attr('y', d => y(d.state))
      .attr('height', y.bandwidth())
      .attr('width', d => Math.abs(x(d.pct) - x(0)))
      .attr('fill', d => color(d.pct))
      .on('mouseenter', (e, d) => {
        tip.style('display', 'block')
           .html(`<strong>${d.state}</strong><br>% change in clinics (2017–2020): ${d.pct}%`);
      })
      .on('mousemove', (e) => {
        const bb = root.node().getBoundingClientRect();
        tip.style('left', (e.clientX - bb.left + 14) + 'px')
           .style('top', (e.clientY - bb.top - 24) + 'px');
      })
      .on('mouseleave', () => tip.style('display', 'none'));
  }

  data.sort((a, b) => d3.descending(a.pct, b.pct));
  renderBars(data);

  d3.select('#sort2').on('change', function () {
    const v = this.value;
    if (v === 'dec') data.sort((a, b) => d3.descending(a.pct, b.pct));
    else if (v === 'inc') data.sort((a, b) => d3.ascending(a.pct, b.pct));
    else data.sort((a, b) => d3.ascending(a.state, b.state));
    renderBars(data);
  });

  function wrapText(text, width) {
    text.each(function() {
      const text = d3.select(this);
      const words = text.text().split(/\s+/).reverse();
      let word, line = [], lineNumber = 0;
      const y = text.attr('y'), dy = parseFloat(text.attr('dy')) || 0;
      let tspan = text.text(null)
                      .append('tspan')
                      .attr('x', -5)
                      .attr('y', y)
                      .attr('dy', dy + 'em');
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan')
                      .attr('x', -5)
                      .attr('y', y)
                      .attr('dy', ++lineNumber * 1.1 + dy + 'em')
                      .text(word);
        }
      }
    });
  }
}




