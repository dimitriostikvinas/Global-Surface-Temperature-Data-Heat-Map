function drawHeatMap(dataset){

    // Select the body element
    const body = d3.select('body');

    // Append the main container div to the body
    const container = body.append('div')
        .attr('id', 'container');

    // Append the title and the subtitle divs to the container
    container.append('div')
        .attr('id', 'title')
        .text('Monthly Global Land-Surface Temperature');

    container.append('div')
        .attr('id', 'subtitle')
        .text(`${dataset.monthlyVariance[0].year} - ${dataset.monthlyVariance[dataset.monthlyVariance.length - 1].year}: Base Temperature ${dataset.baseTemperature}\u00B0C`);

    // Append the heat map div to the container
    container.append('div')
        .attr('id', 'heat-map');

    // Append the tooltip div to the body
    const tooltip = body.append('div')
    .attr('id', 'tooltip');

    // Set up margins, width, and height
    const margin = { top: 30, right: 20, bottom: 50, left: 300 };
    const width = 3000 - margin.left - margin.right;
    const height = 610 - margin.top - margin.bottom;

    const svg = d3.select("#heat-map")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    
    baseTemperature = dataset.baseTemperature;
    data = dataset.monthlyVariance;

    // Assuming `data` is your dataset and `baseTemperature` is defined
    const minTemp = d3.min(data, d => baseTemperature + d.variance) ;
    const maxTemp = d3.max(data, d => baseTemperature + d.variance) ;

    // Generate an array of 9 points (for 8 intervals) spread from min to max
    const numColors = 9;
    const domain = Array.from({length: numColors + 1}, (v, i) => minTemp + i * (maxTemp - minTemp) / numColors);

    const colorScale = d3.scaleLinear()
    .domain(domain)  // These values should be adjusted to your data's scale
    .range([
        '#313695',  // Dark blue
        '#4575b4',  // Lighter blue
        '#74add1',  // Light blue / Cyan
        '#abd9e9',  // Very light blue
        '#e0f3f8',  // Lightest blue / Off-white
        '#fee090',  // Light yellow
        '#fdae61',  // Orange
        '#f46d43',  // Reddish orange
        '#d73027'   // Red
    ]);
    
    const xScale = d3.scaleBand().domain(data.map(d => d.year)).range([0, width]).padding(0.05);
    const yScale = d3.scaleBand().domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).range([height, 0]).padding(0.05);

    var xAxis = d3.axisBottom(xScale).tickValues(data.map(d => d.year).filter(d => d % 10 === 0));
    var yAxis = d3.axisLeft(yScale).tickFormat(d => d3.timeFormat("%B")(new Date(0, d, 0)));

    svg.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

    // Add y-axis
    svg.append('g')
        .attr('transform', `translate(0,0)`)
        .call(yAxis);
    
    
    
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", d => xScale(d.year))
        .attr("y", d => yScale(d.month))
        .attr('width', xScale.bandwidth())
        .attr('height', yScale.bandwidth())
        .style('fill', d => colorScale(baseTemperature + d.variance))
        .style('stroke', 'none') // Default no border
        .style('stroke-width', 0) // Default no border width
        .on('mouseover', (event, d) => {
            d3.select(event.currentTarget)
                .style('stroke', 'black') // Change border color to black on hover
                .style('stroke-width', 2); // Change border color to black on hover
            tooltip.transition()
                .duration(200)
                .style("opacity", 0.9);
            tooltip.html(`${d.year}-${d3.timeFormat("%B")(new Date(0, d.month, 0))}<br>${(baseTemperature + d.variance).toFixed(1)}\u00B0C<br> ${d.variance.toFixed(1) > 0 ? "+" + d.variance.toFixed(1) : d.variance.toFixed(1)}\u00B0C`)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on('mouseout', () => {
            d3.select(event.currentTarget)
                .style('stroke', 'none')
                .style('stroke-width', 0);
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });



    // Correctly append and reference the div for the color palette
    container.append('div')
    .attr('id', 'colours-palette');  // Corrected ID here to match the selection below

    const svgColours = d3.select("#colours-palette")
    .append("svg")
    .attr("width", 300)
    .attr("height", 60) 
    .append("g")
    .attr("transform", "translate(0,0)");  // Adjusted transformation to move the axis into view

    domainFixed = domain.map(d => d.toFixed(1));
    const xScaleColours = d3.scaleBand()
    .domain(domainFixed)
    .range([0, 300])
    .padding(0.05);

    const xAxisColours = d3.axisBottom(xScaleColours).tickValues(domainFixed);
    svgColours.append('g')
        .attr("transform", "translate(0,20)")
        .call(xAxisColours);

    svgColours.selectAll("rect")
        .data(domainFixed)
        .enter()
        .append("rect")
        .attr("x", d => xScaleColours(d))
        .attr("y", -20)
        .attr('width', xScaleColours.bandwidth())
        .attr('height', 40)
        .style('fill', (d, i) => colorScale(d));

};