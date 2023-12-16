
function lineChartVoltageDashboard(){}

lineChartVoltageDashboard.dataCSV = null;
lineChartVoltageDashboard.turbidimeterID = null;
lineChartVoltageDashboard.beginningDate = null;
lineChartVoltageDashboard.endDate = null;


lineChartVoltageDashboard.showIntervalData =
	function(data){
		let dataset1 = [];
		
		if(data == null){
			const svg = document.getElementById("turbidityVoltageLineChartSvg");
				
			while(svg.firstChild)
				svg.removeChild(svg.firstChild);
			// Crea un nuovo elemento text
			const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
			textElement.setAttribute("x", "150");
			textElement.setAttribute("y", "400");
			textElement.setAttribute("font-family", "Arial");
			textElement.setAttribute("font-size", "20");
			textElement.setAttribute("fill", "black");
			textElement.textContent = "Nessun dato disponibile per il turbidimetro e l'arco di tempo selezionati";

			// Aggiungi l'elemento text all'elemento SVG
			svg.appendChild(textElement);
			return;
		}else
		{
			const svg = document.getElementById("turbidityVoltageLineChartSvg");
			while(svg.firstChild)
				svg.removeChild(svg.firstChild);
		}
		for(let i = 0; i < data.length; i++){
				dataset1[i] = {date: data[i].timestamp, value: data[i].voltage};

		}
		
		dataCSV = dataset1;
		lineChartVoltageDashboard.turbidimeterID = document.getElementById("turbidimetri").value;
		lineChartVoltageDashboard.beginningDate = document.getElementById("inizioIntervallo").value;
		lineChartVoltageDashboard.endDate = document.getElementById("fineIntervallo").value;
		lineChartVoltageDashboard.oraInizio = document.getElementById("oraInizio").value;
		lineChartVoltageDashboard.oraFine = document.getElementById("oraFine").value;

		
		svg = document.getElementById("turbidityVoltageLineChartSvg");
				
		while(svg.firstChild)
			svg.removeChild(svg.firstChild);

		//Le vuole come stringhe
		const parseDate = d3.timeParse("%Y-%m-%d %H:%M:%S");
		
		dataset1.forEach((d) => {
			d.date = parseDate(d.date);
			d.value = Number(d.value);
		});
		
		const X = dataset1.map(d => d.date);
		const Y = dataset1.map(d => d.value);
		 

        // Step 3
        svg = d3.select("#turbidityVoltageLineChartSvg"),
			margin = 220,//170,
			marginTop = -20,
			marginBottom = -20,
            width = svg.attr("width") - 130, //300
            height = svg.attr("height") - margin //200

        // Step 4 
        let xScale = d3.scaleTime()
					.domain(d3.extent(X))
					.range([0, width]);
        let yScale = d3.scaleLinear()
					.domain([d3.min(Y), d3.max(Y)])
					.range([height-marginBottom, marginTop]);
            
        let g = svg.append("g")
            .attr("transform", "translate(" + 100 + "," + 100 + ")");

        // Step 5
        // Title
        svg.append('text')
        .attr('x', width/2 + 100)
        .attr('y', 100)
        .attr('text-anchor', 'middle')
        .style('font-family', 'Helvetica')
        .style('font-size', 24)
	.style('font-weight', 'bold')
        .text('Tensione della batteria del turbidimetro n.' + document.getElementById("turbidimetri").value);

        // Step 6
		//formatto le date in ordine mese-giorno orario per maggiore leggibilità
		//(l'anno è intuibile dall'arco di tempo selezionato)
        g.append("g")
         .attr("transform", "translate(0," + 700 + ")")
         .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat("%m-%d %H:%M:%S")));
        
        g.append("g")
         .call(d3.axisLeft(yScale));
        
        // Step 7
        svg.append('g')
        .selectAll("dot")
        .data(dataset1)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return xScale(d.date); } )
		.attr("cy", function (d) { return yScale(d.value); } )
        .attr("r", 3)
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .style("fill", "steelblue");

        // Step 8        
        let line = d3.line()
        .x(function(d) { return xScale(d.date); }) 
		.y(function(d) { return yScale(d.value); })
        .curve(d3.curveLinear)
        
        svg.append("path")
        .datum(dataset1) 
        .attr("class", "line") 
        .attr("transform", "translate(" + 100 + "," + 100 + ")")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", "steelblue")
        .style("stroke-width", "2");
	
	//Dopo aver aggiornato il grafico lo rendo nuovamente visibile, nel caso fosse stato nascosto
	document.getElementById("turbidityVoltageLineChartSvg").style.display = "flex";
}

lineChartVoltageDashboard.showNoData =
	function(){
	/*imposto i dati a null, gestisco la situazione nella funzione della stampa*/
		dataCSV = null;
	}
	
//Scarica un file CSV contenente i dati graficati 	
lineChartVoltageDashboard.exportCSVData =
	function(){
		let csvContent = "data:text/csv;charset=utf-8,";
		csvContent += "date,value\r\n";

		// Itera attraverso gli elementi dell'array e aggiungi i valori alla stringa CSV
		if(dataCSV){ //Solo se ci sono dati mostrati nel grafico
			dataCSV.forEach(function (item) {
				let row = item.date + "," + item.value;
					csvContent += row + "\r\n";
				});
			}
			
		let encodedUri = encodeURI(csvContent);
		let link = document.createElement("a");
		link.setAttribute("href", encodedUri);
		link.setAttribute("download", "turbidimeter_voltage" + lineChartVoltageDashboard.turbidimeterID + "_" + lineChartVoltageDashboard.beginningDate + "_" + lineChartVoltageDashboard.endDate + ".csv");
		document.body.appendChild(link);

		link.click();		
			
		
	}
