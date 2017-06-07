function map() {
	var width = 1000, height = 500;
	var margin = {top: 20, right: 20, bottom: 30, left: 40};
	var w = width - margin.right - margin.left,
		h = height - margin.top - margin.bottom;
	
	var Category;
	
	if (document.getElementById('sel_Category1').checked) 
		Category= document.getElementById('sel_Category1').value;
	if (document.getElementById('sel_Category2').checked) 
		Category= document.getElementById('sel_Category2').value;
	if (document.getElementById('sel_Category3').checked) 
		Category= document.getElementById('sel_Category3').value;
	if (document.getElementById('sel_Category4').checked) 
		Category= document.getElementById('sel_Category4').value;
	if (document.getElementById('sel_Category5').checked) 
		Category= document.getElementById('sel_Category5').value;
	if (document.getElementById('sel_Category6').checked) 
		Category= document.getElementById('sel_Category6').value;
	
		console.log(Category);
		
	d3.select("#map").select("svg").remove();	
	var s1 = d3.select("#map").append("svg")
			.attr("width", w)
			.attr("height", h)
			.append("g")
			.attr("transform","translate(" + margin.left + "," + margin.top + ")");			
			
	d3.queue()
	  .defer(d3.json,"world-countries.json")
	  .defer(d3.csv,"ListNobelWinners.csv")
	  .await(ready);
	  
	var projection = d3.geoMercator()
						.translate([w/2, h/2])
						.scale(120);
						
	var path = d3.geoPath()
				 .projection(projection);
	  
	function ready(error,data, winners) {
	//	console.log(data);
		
		var countries = topojson.feature(data, data.objects.countries1).features; //
		console.log(countries);
		
		var div = d3.select("#map").append("div")
			.attr("class", "tooltip")
			.style("opacity", 0);
	
		s1.selectAll(".country")
		  .data(countries)
		  .enter()
		  .append("path")
		  .attr("class","country")
		  .attr("d",path);
	  
		var data1 = winners.filter(function(data) { return  data.Category == Category});
			
			//console.log(data1);
					
			grpByCategory = d3.nest()
						.key(function(d) { return d.Country_of_Birth; })
						.rollup(function(v) { return v.length; })
						.entries(data1);
		
			console.log(grpByCategory); 
		
		var count = grpByCategory.length;
		var max = 0;
		var min = grpByCategory[0].value;
		var avg = (min+max)/2;
		for(i=0;i<count;i++) {
				if(max <= grpByCategory[i].value)
					max = grpByCategory[i].value;
		}
		
		for(i=0;i<count;i++) {
				if(min >= grpByCategory[i].value)
					min = grpByCategory[i].value;
		}
		
		console.log(count+","+max+","+min);
		
		var color = d3.scaleLinear()
					.domain([min,avg,max])
					.interpolate(d3.interpolateHcl)
					.range(["#F9D565", "#C5A130","#81640A"]);
			
		s1.selectAll(".country")
		  .data(countries)
		  .attr("fill", function(d) {
				var flag =0;
				for(i=0;i<grpByCategory.length;i++) {
						if(d.properties.name == grpByCategory[i].key) {
							flag=1;
						break; }
				}
				if(flag ==1)
					return color(grpByCategory[i].value);
				else
					return "Grey";
				
			})
			.on('mouseover', function(d) {
				d3.select(this)
				//console.log(this)
				div.transition()
				.duration(200)
				.style("opacity", .9);
				//console.log(d.properties.name)
				var flag =0;
				for(i=0;i<grpByCategory.length;i++) {
						if(d.properties.name == grpByCategory[i].key) {
							flag =1;
						break; }
				}
				if(flag ==1) {
				div.html(""+ grpByCategory[i].key + "<br/>" + grpByCategory[i].value)
					.style("left", (d3.event.pageX) + "px")
					.style("top", (d3.event.pageY) - 40 + "px");
				}
			})
			.on('mouseout', function(d) {
				d3.select(this)
				div.transition()
					.duration(500)
					.style("opacity", 0);
		  });
	}// ready
	
}