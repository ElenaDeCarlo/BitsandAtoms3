async function readJson(path) {
  const response = await fetch(path);
  const data = await response.json();
  return data;
}
// Réjane Schrago teached and helped =)
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/bubble-chart

function BubbleChart(svg, data, {
  name = ([x]) => x, // alias for label
  label = name, // given d in data, returns text to display on the bubble
  value = ([, y]) => y, // given d in data, returns a quantitative size
  group, // given d in data, returns a categorical value for color
  title, // given d in data, returns text to show on hover
  link, // given a node d, its link (if any)
  linkTarget = "_blank", // the target attribute for links, if any
  width = 640, // outer width, in pixels
  height = width, // outer height, in pixels
  padding = 20, // padding between circles
  margin = 20, // default margins
  marginTop = margin, // top margin, in pixels
  marginRight = margin, // right margin, in pixels
  marginBottom = margin, // bottom margin, in pixels
  marginLeft = margin, // left margin, in pixels
  groups, // array of group names (the domain of the color scale)
  colors = d3.schemeTableau10, // an array of colors (for groups)
  fill = "#9994ee", // a static fill color, if no group channel is specified
  fillOpacity = 1, // the fill opacity of the bubbles
  stroke, // a static stroke around the bubbles
  strokeWidth, // the stroke width around the bubbles, if any
  strokeOpacity, // the stroke opacity around the bubbles, if any
} = {}) {
  // Compute the values.
  const D = d3.map(data, d => d);
  const V = d3.map(data, value);
  const G = group == null ? null : d3.map(data, group);
  const I = d3.range(V.length).filter(i => V[i] > 0);

  // Unique the groups.
  if (G && groups === undefined) groups = I.map(i => G[i]);
  groups = G && new d3.InternSet(groups);

  // Construct scales.
  const color = G && d3.scaleOrdinal(groups, colors);

  // Compute labels and titles.
  const L = label == null ? null : d3.map(data, label);
  const T = title === undefined ? L : title == null ? null : d3.map(data, title);

  // Compute layout: create a 1-deep hierarchy, and pack it.
  const root = d3.pack()
      .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
      .padding(padding)
    (d3.hierarchy({children: I})
      .sum(i => V[i]));

  const leaf = svg.selectAll("a")
    .data(root.leaves())
    .join("a")
      .attr("xlink:href", link == null ? null : (d, i) => link(D[d.data], i, data))
      .attr("target", link == null ? null : linkTarget)
      .attr("transform", d => `translate(${d.x},${d.y})`);

  leaf.append("circle")
      .attr("stroke", stroke)
      .attr("stroke-width", strokeWidth)
      .attr("stroke-opacity", strokeOpacity)
      .attr("fill", G ? d => color(G[d.data]) : fill == null ? "none" : fill)
      .attr("fill-opacity", fillOpacity)
      .attr("r", d => d.r);

  if (T) leaf.append("title")
      .text(d => T[d.data]);

  if (L) {
    // A unique identifier for clip paths (to avoid conflicts).
    const uid = `O-${Math.random().toString(16).slice(2)}`;

    leaf.append("clipPath")
        .attr("id", d => `${uid}-clip-${d.data}`)
        .append("circle")
        .attr("r", d => d.r);

    leaf.append("text")
    //.attr("clip-path", d => `url(${new URL(`#${uid}-clip-${d.data}`, location)})`)
      .selectAll("tspan")
      .data(d => `${L[d.data]}`.split(/\n/g))
      .join("tspan")
        .attr("x", (d, i,D) => `${i - d.length / 4 }em`)
        .attr("y", (d, i, D) => `${i - D.length / 2 + 0.85}em`)
        .text(d => d);
  }

  return Object.assign(svg.node(), {scales: {color}});
}

/**
 *  Gets the maximum value in a collection of numbers.
 */
function getMax(collection) {
  let max = 0;

  collection.forEach((element) => {
    max = element > max ? element : max;
  });

  return max;
}


async function init() {
  // json file generated with https://csvjson.com/csv2json
  const data = await readJson('future_cities_data.json');
  let simplifiedData = data.map((d) => {
    return {
      minTempmon: d['Min_Temperature_of_Coldest_Month'],
      city: d['current_city'],
    };
  });

  console.log('simplifiedData: ', simplifiedData);

  const chartWidth = 1600;
  const chartHeight = 1600;

  const local = d3.local();

  const svg = d3
    .select('#d3')
    .append('svg')
    .attr('width', chartWidth)
    .attr('height', chartHeight);


  const selection = svg.selectAll('circle').data(simplifiedData).enter();

  console.log('selection: ', selection);

  chart = BubbleChart(svg, simplifiedData, {
    label: d => d.minTempmon.toFixed(1), 
    value: d => d.minTempmon,
    title: d => d.city,
    width: 1500
  })

  svg
    .selectAll('circle')
    .on('mouseover', function () {
      const city = this.dataset.city;
      d3.select('#tooltip').text(city).style('visibility', 'visible');
      
    })
    .on('mousemove', function (event) {
      const coords = d3.pointer(event);

      d3.select('#tooltip')
        .style('left', coords[0] + 20 + 'px')
        .style('top', coords[1] - 10 + 'px');
        s
    })
   

}

init();
