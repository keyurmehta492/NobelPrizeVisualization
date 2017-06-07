function bar() {
		var width = 1000, height = 500;
		var margin = {top: 20, right: 20, bottom: 30, left: 40};
		var w = width - margin.right - margin.left,
			h = height - margin.top - margin.bottom;
		var grpByCategory;
			
		var continent = document.getElementById('sel_continent').value;
		console.log(continent);
		
		d3.csv("ListNobelWinners.csv",function(error, data) {
			
			var data1 = data.filter(function(data) { return  data.Continent == continent});
			
			console.log(data1);
					
			grpByCategory = d3.nest()
						.key(function(d) { return d.Category; })
						.rollup(function(v) { return v.length; })
						.entries(data1);
								 
			console.log(grpByCategory);
		
	//****************Bar chart**********
		d3.select("#chart").select("svg").remove();
		
		var s1 = d3.select("#chart").append("svg")
				.attr("width", width)
				.attr("height", height)
				.append("g")
				.attr("transform","translate(" + margin.left + "," + margin.top + ")");
		
		var count = grpByCategory.length;
		var max = 0;
		var min = grpByCategory[0].value;
		
		for(i=0;i<count;i++) {
				if(max <= grpByCategory[i].value)
					max = grpByCategory[i].value;
		}
		
		for(i=0;i<count;i++) {
				if(min >= grpByCategory[i].value)
					min = grpByCategory[i].value;
		}
		
		console.log(count+","+max+","+min);
		
		var xScale = d3.scaleBand()
					.domain(grpByCategory.map(function(d) {return d.key;}))
					.rangeRound([0,w])
					.padding(0.1);
					
		
		var yScale = d3.scaleLinear()
					.domain([max + 1,min - 1])
					.range([(margin.top),(h)]);
					
		var xaxis = d3.axisBottom()	  
					  .scale(xScale);
					  
					 
		var yaxis = d3.axisLeft()	  
					  .scale(yScale)
					  .tickFormat(d3.format("d"));
				
					  
		var color = d3.scaleOrdinal(d3.schemeCategory20);
		
		s1.append("g")
		   .attr("transform","translate(0,0) ")  //+ margin.left + ", " + margin.top + ")")
		   .call(yaxis)
		   .attr("class", "yAxis");
			
		s1.append("g")
		   .attr("transform","translate(" +(0) + " , " + (h)  +")")
		   .call(xaxis);
		   
		   var tooltip = d3.select("#chart").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);
		
		s1.selectAll("rect")
		  .data(grpByCategory)
		  .enter()
		  .append("rect")
		  .attr("x",function(d)
				{ 
					return  xScale(d.key) + 25;
				})
		  .attr("y",function(d) { 
					return yScale(d.value);
				 })
		  .attr("width",30) //xScale.bandwidth())
		  .attr("height", function(d) {return (h - yScale(d.value) );})
		  .attr("fill",function(d,i) { return color(i) } )
		  .attr("transform","translate( " + margin.left + " ,0)")
		  .on('mouseover', function(d) {
				
				tooltip.transition()
				.duration(200)
				.style("opacity", .9);
				tooltip.html("Category: "+ d.key + "<br/>" + "Award:" + d.value)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY) - 40 + "px");
		  })
		  .on('mouseout', function(d) {
				
				tooltip.transition()
					.duration(500)
					.style("opacity", 0);
		  });	

		s1.append("text")                               
          .attr("x", 400)     
          .attr("y", 25)
		  .text("Awards won by " + continent + " per category ")
          .attr("fill", "blue")
		  .attr("font-size",20);
		  
		s1.append("text")       
          .attr("transform",
            "translate(" + (width/2 + 10) + " ," + 
                           (h + 25) + ")")
		.style("text-anchor", "middle")
		.text("Category")
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
} //bar