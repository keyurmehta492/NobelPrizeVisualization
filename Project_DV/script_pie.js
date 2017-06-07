function pie() {
		var width = 1000, height = 500;
		var margin = {top: 20, right: 20, bottom: 30, left: 40};
		var w = width - margin.right - margin.left,
			h = height - margin.top - margin.bottom;
		var grpByGender;
		var pTime = d3.timeParse("%Y");	
		var continent = document.getElementById('sel_continent').value;
		console.log(continent);
		
		d3.csv("ListNobelWinners.csv",function(error, data) {
			
			var data1 = data.filter(function(data) { return  data.Continent == continent});
			
			data.forEach(function(d)  {
				d.year = pTime(d.Year);
				d.name = d.Winner;
				d.gender =d.Gender;
				return d;
			});
			
			console.log(data1);
			
			grpByGender = d3.nest()
						.key(function(d) { return d.gender; })
						.rollup(function(v) { return v.length; })
						.entries(data1);
						 
			console.log(grpByGender);
			
	//*******************	Pie chart *********************
		
		var color = d3.scaleOrdinal(d3.schemeCategory20);
		
		d3.select("#chart").select("svg").remove();
		
		var s1 = d3.select("#chart").append("svg")
				.attr("width", w)
				.attr("height", h);
				
		var r = 300;
		var p = Math.PI * 2;
		
		var arc = d3.arc()
				.innerRadius(0)
				.outerRadius(r-150)
			
		var pie = d3.pie()
					.value( function (d) { return d.value; })
					.sort(null);					
					
		var arcs = s1.selectAll("g.arc")
					.data(pie(grpByGender))
					.enter()
					.append("g")
					.attr("transform","translate(500,250)");
		
		  var tooltip = d3.select("#chart").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);
				
		arcs.append("path")
		  .attr("d", arc)
		  .attr("fill", function(d, i) {
					if(grpByGender[i].key =="Male")
						return "skyBlue";
					if(grpByGender[i].key =="Female")
						return "Pink";
					if(grpByGender[i].key =="Organization")
						return "Green";
			    });
		
				
		arcs.append("text")
		    .attr("transform", function(d) {
			    	return "translate(" + arc.centroid(d) + ")";
			})
			.attr("text-anchor", "middle")
			.text(function(d,i) {
			   	return grpByGender[i].value;
			});
			
			
		/*arcs.append("text")
			.attr("transform", function(d) { 
					var c = arc.centroid(d),
					x = c[0],
					y = c[1],
            
					root = Math.sqrt(x*x + y*y);
				return "translate(" + (x/root * 200) +  ',' +  (y/root * 200) +  ")"; 
		     })
			.attr("text-anchor", "middle") 
			.style("fill", "Red")
			.style("font", "bold 12px Arial")
			.text(function(d, i) { return grpByGender[i].key; });*/

		s1.append("text")                               
          .attr("x", 400)     
          .attr("y", 40)
		  .text("Awards won by " + continent + " per gender")
          .attr("fill", "blue")
		  .attr("font-size",20);
		
		s1.append("circle")                               
          .attr("cx", 780)     
          .attr("cy", 70)
		  .attr("r",5)
          .attr("fill", "skyblue");
         
        s1.append("text")       
          .attr("x", 790)       
          .attr("y", 75)        
          .text("Male")
		  .attr("fill","skyblue");      
		  
		s1.append("circle")                               
          .attr("cx", 780)     
          .attr("cy", 90)
		  .attr("r",5)
          .attr("fill", "Pink");
         
        s1.append("text")       
          .attr("x", 790)       
          .attr("y", 95)        
          .text("Female")
		  .attr("fill","Pink");
		  
		s1.append("circle")                               
          .attr("cx", 780)     
          .attr("cy", 110)
		  .attr("r",5)
          .attr("fill", "Green");
         
        s1.append("text")       
          .attr("x", 790)       
          .attr("y", 115)        
          .text("Organization")
		  .attr("fill","Green");
		}) //csv function	
		
} //pie