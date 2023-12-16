function turbidityVoltageChartSvg(){}

function showData(){
	
	var beginningDate = document.getElementById("inizioIntervallo").value;
	var endDate = document.getElementById("fineIntervallo").value;
	var turbidimeterID = document.getElementById("turbidimetri").value;
	//getTurbidimeters();
  // Step 1
		//Recuperare il dataset dalla cartella relativa e fare una funzione per aggiornare i dati disponibili ogni tot secondi
        var dataset1 = [
			{date: "2007-04-23", close: 93.24},
			{date: "2007-04-24", close: 95.35},
			{date: "2007-04-25", close: 98.84},
			{date: "2007-04-26", close: 99.92},
			{date: "2007-04-29", close: 99.8},
			{date: "2007-05-01", close: 99.47},
			{date: "2007-05-02", close: 100.39},
			{date: "2007-05-03", close: 100.4},
			{date: "2007-05-04", close: 100.81},
			{date: "2007-05-07", close: 103.92},
			{date: "2007-05-08", close: 105.06}
		];
		//Le vuole come stringhe
		const parseDate = d3.timeParse("%Y-%m-%d");
		
		dataset1.forEach((d) => {
			d.date = parseDate(d.date);
			d.close = Number(d.close);
		});
		
		const X = dataset1.map(d => d.date);
		const Y = dataset1.map(d => d.close);

        // Step 3
        var svg = d3.select("#turbidityVoltageLineChartSvg"),
			margin = 50,
            marginTop = 20, // top margin, in pixels
			marginRight = 30, // right margin, in pixels
			marginBottom = 30, // bottom margin, in pixels
			marginLeft = 40,
            width = svg.attr("width"), //300
            height = svg.attr("height") //200

        // Step 4 
        var xScale = d3.scaleTime()
					.domain(d3.extent(X))
					.range([0, width]);
        var yScale = d3.scaleLinear()
					.domain([d3.min(Y), d3.max(Y)])
					.range([height-marginBottom, marginTop]);
            
        var g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

        // Step 5
        // Title
        svg.append('text')
        .attr('x', width/2 + 100)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 20)
        .text('Line Chart');
        
        // X label
        svg.append('text')
        .attr('x', width/2 + 100)
        .attr('y', height - 15 + 150)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 16)
        .text('Independant');
        
        // Y label
        svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(60,' + height + ')rotate(-90)')
        .style('font-family', 'Helvetica')
        .style('font-size', 16)
        .text('Dependant');

        // Step 6
        g.append("g")
         .attr("transform", "translate(0," + 700 + ")")
         .call(d3.axisBottom(xScale));
        
        g.append("g")
         .call(d3.axisLeft(yScale));
        
        // Step 7
        svg.append('g')
        .selectAll("dot")
        .data(dataset1)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d.date); } )
		.attr("cy", function (d) { return yScale(d.close); } )
        .attr("r", 3)
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", "steelblue");

        // Step 8        
        var line = d3.line()
        .x(function(d) { return xScale(d.date); }) 
		.y(function(d) { return yScale(d.close); })
        .curve(d3.curveLinear)
        
        svg.append("path")
        .datum(dataset1) 
        .attr("class", "line") 
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "steelblue")
        .style("stroke-width", "2");
}