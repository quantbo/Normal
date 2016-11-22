var svg = d3.select('svg');
var height = svg.attr('height'), width = svg.attr('width');
//Leave space for axes, axis labels, title.
var margin = {top: Math.round(height * 0.15),
						 right: Math.round(width * 0.15),
						 bottom: Math.round(height * 0.10),
						 left: Math.round(width * 0.15)};
//Grouping element where graphing takes place.
var inner = svg.append('g')
	.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
//The dimensions of the graphing area.
var heightInner = height - margin.top - margin.bottom,
		widthInner = width - margin.left - margin.right;
//Draw a box congruent with the 'inner' element.
var boxInner = inner.append('rect')
	.attr('id', 'boxInner')
	.attr('height', heightInner)
	.attr('width', widthInner);
//Generate data; there will be nn + 1 rows of data.
var theData = [], nn = 100, begin = -3, end = 3, span = end - begin;
for (var ii = 0; ii <= nn;  ++ii) {
	//The next line avoids buildup of rounding errors in the specification of x values.
	var x = begin + span * ii / nn;
	var row = {x: x, pdf: jStat.normal.pdf(x, 0, 1), cdf: jStat.normal.cdf(x, 0, 1)};
	theData.push(row);
}

//Define scales.
var xScale = d3.scaleLinear()
	.domain(d3.extent(theData, function(d) {return d.x;}))
	.range([0, widthInner]);
//There are y scales for the PDF and CDF.
var yScalePDF = d3.scaleLinear()
	.domain(d3.extent(theData, function(d) {return d.pdf;}))
	.range([heightInner, 0]).nice();
var yScaleCDF = d3.scaleLinear()
	//The domain of the CDF is (0, 1).
	.domain([0, 1])
	.range([heightInner, 0]).nice();

//Define lines.
var linePDF = d3.line()
	.x(function(d) { return xScale(d.x); })
	.y(function(d) { return yScalePDF(d.pdf); });
var lineCDF = d3.line()
	.x(function(d) { return xScale(d.x); })
	.y(function(d) { return yScaleCDF(d.cdf); });

//Add paths.
inner.append('path')
		.data([theData]) //Notice that the argument is enclosed in square brackets.
		.attr('class', 'line')
		.attr('d', linePDF);
inner.append('path')
		.data([theData])
		.attr('class', 'line cdf') //The CDF gets additional styling.
		.attr('d', lineCDF);

//Legend.
var Lfactor1 = -0.45, Lfactor2 = -0.25;
inner.append('line')
	.attr('x1', 0)
	.attr('x2', 0.10 * widthInner)
	.attr('y1', Lfactor1 * margin.top)
	.attr('y2', Lfactor1 * margin.top)
	.attr('class', 'line');
inner.append('text')
	.text('probability density function')
	.attr('x', 0.11 * widthInner)
	.attr('y', Lfactor1 * margin.top)
	.attr('class', 'legend-text');
inner.append('line')
	.attr('x1', 0)
	.attr('x2', 0.10 * widthInner)
	.attr('y1', Lfactor2 * margin.top)
	.attr('y2', Lfactor2 * margin.top)
	.attr('class', 'line cdf');
inner.append('text')
	.text('cumulative distribution function')
	.attr('x', 0.11 * widthInner)
	.attr('y', Lfactor2 * margin.top)
	.attr('class', 'legend-text');

//Add axes.
inner.append('g')
	.call(d3.axisLeft(yScalePDF))
	.attr('class', 'axis');
//In order for the translate to apply to the axis alone, and not to the entire 'inner' element, the axis must be placed within its own 'g' element.
inner.append('g')
	.call(d3.axisRight(yScaleCDF))
	.attr('class', 'axis')
	.attr('transform', 'translate(' + widthInner + ', 0)');
inner.append('g')
	.call(d3.axisBottom(xScale))
	.attr('class', 'axis')
	.attr('transform', 'translate(0, ' + heightInner + ')');

//Add a mathematical y axis.
inner.append('line')
	.attr('x1', widthInner / 2)
	.attr('x2', widthInner / 2)
	.attr('y1', 0)
	.attr('y2', heightInner)
	.style('stroke', 'black')
	.style('stroke-width', 'black')
	.style('stroke-opacity', 0.66);

//Add axis labels, title.
inner.append('text') //Left axis.
	.attr('class', 'axis-label')
	.text('Probability density')
	//When an element has been rotated -90 degrees, translations along the x axis move the element up or down; translations along the y axis move it left or right.
	.attr('transform', 'rotate(-90) translate(' + (-heightInner/2) + ',' + (-0.6 * margin.left) + ')');
inner.append('text') //Right axis.
	.attr('class', 'axis-label')
	.text('Probability')
	.attr('transform', 'rotate(-90) translate('
				+ (-heightInner/2) + ',' + (widthInner + 0.6 * margin.right) + ')');
inner.append('text') //Title.
	.attr('class', 'title')
	.text('Normal probability density & cumulative distribution functions')
	.attr('transform', 'translate(' + (widthInner / 2) + ',' + (-0.8 * margin.top) + ')');
