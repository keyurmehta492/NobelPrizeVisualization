function timeline() {
		var width = 1300, height = 500;
		var margin = {top: 20, right: 20, bottom: 30, left: 40};
		var w = width - margin.right - margin.left,
			h = height - margin.top - margin.bottom;
		var grpByCountry;
		
		var country = document.getElementById('sel_country').value;
		console.log(country);
		
		var pTime = d3.timeParse("%Y");
		
		d3.csv("ListNobelWinners.csv",function(error, data) {
			
			data.forEach(function(d)  {
				d.year = +(d.Year);
				return d;
			});
			//console.log(data);
			
			var data1 = data.filter(function(data) { return  data.Country_of_Birth == country});
			console.log(data1);
			
			grpByCountry = d3.nest()
						.key(function(d) { return d.year; })
						.rollup(function(v) { return v.length; })
						.entries(data1);
						 
			console.log(grpByCountry);
		
	//*******************	time chart *********************
	
	d3.select("#timeline").select("svg").remove();
		
		var s1 = d3.select("#timeline").append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform","translate(" + margin.left + "," + margin.top + ")");
		
		var min = pTime(d3.min(data1, function(d) {return d.year})).getFullYear();
		var max = pTime(d3.max(data1, function(d) {return d.year})).getFullYear();
		var count = grpByCountry.length;
		var max2 = 0;
				
		for(i=0;i<count;i++) {
				if(max2 <= grpByCountry[i].value)
					max2 = grpByCountry[i].value;
		}
		
		console.log(min +","+ max+","+count+","+max2);
		
		var xScale = d3.scaleBand()
					.domain(grpByCountry.map(function(d) {return d.key;}))
					//.domain([min,max])
					.range([0,w])
					.padding(0.1);
					
		
		var yScale = d3.scaleLinear()
					.domain([max2 + 1,0])
					.range([(margin.top),(h - margin.bottom)]);
					
					
		var xaxis = d3.axisBottom()	  
					  .scale(xScale);
					  
					  //.tickFormat(d3.timeFormat("%Y")); 
					 
		var yaxis = d3.axisLeft()	  
					  .scale(yScale)
					  .tickFormat(d3.format("d"))
					  .ticks(max2+1);

		var line = d3.line()
					 .x(function(d) { return xScale(d.key); })
					 .y(function(d) { return yScale(d.value); });
		
		var tooltip = d3.select("#timeline").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);		
		 
			s1.append("path")
			.data([grpByCountry])
			.attr("class", "line")
			.attr("stroke", "steelblue")
			.attr("d", line)
			//.attr("transform","translate(" + margin.left + ","+ "0)")
			.attr("fill","none");
			
		  
		  //.attr("transform","translate( 0,0)"); 
		  
		  s1.selectAll("circle")
		  .data(grpByCountry)
		  .enter()
		  .append("circle")
		  
		  .attr("cx",function(d)
				{ 
					return (xScale(d.key) );
				})
		  .attr("cy",function(d) { 
					return yScale(d.value);
				 })
			.attr("r",function(d) {
				return d.value * 4})
		   .attr("fill","purple" )
		   .attr("stroke","yellow")
		   .attr("stroke-width", 1)
		   .on('mouseover', function(d) {
				
				tooltip.transition()
				.duration(200)
				.style("opacity", .9);
				tooltip.html("Year: "+ d.key + "<br/>" + "Award:"+ d.value)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY) - 40 + "px");
		  })
		  .on('mouseout', function(d) {
				
				tooltip.transition()
					.duration(500)
					.style("opacity", 0);
		  })
		  .on('click',function (d) {
				d3.select("#detail").selectAll("label").remove();
				
				var year = d.key;
				var data2 = data.filter(function(data) { return  data.Country_of_Birth == country});
				console.log(data2);
				var detail = document.getElementById("detail");
				
				for(i=0;i<data2.length;i++) {
						if(data2[i].year == year) {
							var label = document.createElement("Label");
							label.innerHTML = "<b>Name: </b> " + data2[i].Winner + "<br>" +
											"<b>Age at Nobel win:</b> " + data2[i].Age +
											"\t <b>Gender:</b> "+ data2[i].Gender + "<br>" +
											"<b>Year:</b> " + data2[i].Year + 
											"\t<b> Category: </b>"+ data2[i].Category +"<br>" +
											"<b>Description: </b>" + data2[i].Description + "<br><br>";
							
							detail.appendChild(label);							
						}
							
				} 
				
		});
		  //.attr("transform","translate("+margin.left+" ,0)");;
		
		
		
		
		s1.append("g")
		   .attr("transform","translate(0,0) ")  //+ margin.left + ", " + margin.top + ")")
		   .call(yaxis)
		   .attr("class", "yAxis");
			
		s1.append("g")
		   .attr("transform","translate(" +(0) + " , " + (h - margin.bottom)  +")")
		   .call(xaxis)
		   .selectAll("text")
				.attr("dx", "-2em")
				.attr("dy", "-1em")
				.attr("transform","rotate(-90)");
		
		s1.append("text")                               
          .attr("x", 400)     
          .attr("y", 25)
		  .text("Awards won by " + country + " year wise")
          .attr("fill", "blue")
		  .attr("font-size",20);
		  
		s1.append("text")       
          .attr("transform",
            "translate(" + (width/2 + 10) + " ," + 
                           (h + 25) + ")")
		.style("text-anchor", "middle")
		.text("Year")
     	  .attr("fill","blue"); 
		  
		s1.append("text")       
          .attr("transform", "rotate(-90)")
			.attr("y", 0 - margin.left)
			.attr("x",0 - (height / 2))
			.attr("dy", "1em")
			.style("text-anchor", "middle")
			.text("Count")
			.attr("fill","blue");      
		  
		
		}); //csv
} //timeline function