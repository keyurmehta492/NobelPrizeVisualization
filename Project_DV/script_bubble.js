function bubble() {
		var width = 1300, height = 500;
		var margin = {top: 20, right: 20, bottom: 30, left: 40};
		var w = width - margin.right - margin.left,
			h = height - margin.top - margin.bottom;
		var grpByCountry;
		var pTime = d3.timeParse("%Y");	
		var continent = document.getElementById('sel_continent').value;
		console.log(continent);
		
		d3.csv("ListNobelWinners.csv",function(error, data) {
			
			var data1 = data.filter(function(data) { return  data.Continent == continent});
			
			console.log(data1);
					
			grpByCountry = d3.nest()
						.key(function(d) { return d.Country_of_Birth; })
						.rollup(function(v) { return v.length; })
						.entries(data1);
								 
			console.log(grpByCountry);
			
	//******************* Bubble chart *********************
		
		d3.select("#chart").select("svg").remove();
		
		var s1 = d3.select("#chart").append("svg")
				.attr("width", w)
				.attr("height", h)
				.append("g")
				.attr("transform","translate(" + w/2 + "," + h/2 + ")");
		
		var min = d3.min(grpByCountry, function(d) {return d.value});
		var max = d3.max(grpByCountry, function(d) {return d.value});
		console.log(min +","+ max);
		
		var color = d3.scaleLinear()
					.domain([min,max])
					.range(["#25D94B","#5D12A0","#5D12A0"]);
		
		var radiusscale = d3.scaleSqrt()
							.domain([min,max])
							.range([20, 80]);
							
		var force = d3.forceSimulation()
					  .force("x",d3.forceX(0).strength(0.1))
					  .force("y",d3.forceY(0).strength(0.1))
					  .force("colision",d3.forceCollide(function(d) 
					  {return radiusscale(d.value)+3}
					  ));
				
		var tooltip = d3.select("#chart").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);
			
		var circles = s1.selectAll("circles")
						.data(grpByCountry)
						.enter()
						.append("circle")
						.attr("r",function(d) {return radiusscale(d.value)})
						.attr("fill", function(d) {return color(d.value)})
						.on('mouseover', function(d) {
							
							tooltip.transition()
								.duration(200)
								.style("opacity", .9);
							tooltip.html("Awards: " + "<br/>" + d.value)
								.style("left", (d3.event.pageX) + "px")
								.style("top", (d3.event.pageY) - 40 + "px");
						})
						.on('mouseout', function(d) {
							
							tooltip.transition()
								.duration(500)
								.style("opacity", 0);
		  });
			
		var labels = s1.selectAll("label")
						.data(grpByCountry)
						.enter()
						.append("text")
						.attr("text-anchor", "middle")
						.attr("fill", "black")
						.attr("font-size", "12px")
						.text(function(d) {
							return d.key;
						});
				
		force.nodes(grpByCountry)
			 .on("tick",position);
						
		function position() {
			circles.attr("cx",function(d) {return d.x})
				   .attr("cy",function(d) {return d.y});
				   
			labels.attr("x", function(d) {return d.x;})
				  .attr("y", function(d) {return d.y;});
		}
		
		s1.append("text")                               
          .attr("x", 200)     
          .attr("y", -200)
		  .text("Awards won by " + continent + " per country")
          .attr("fill", "blue")
		  .attr("font-size",20);
		  
		}) //csv function	
		
} //bubble