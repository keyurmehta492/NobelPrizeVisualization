function country() {
	
	d3.csv("ListNobelWinners.csv",function(error, data) {
			
			//var data1 = data.filter(function(data) { return  data.Continent == continent});
			var s = d3.select("#sel_country");
			data.forEach(function(d)  {
				d.countries =d.Country_of_Birth;
				return d;
			});
			
			var uni = d3.nest()
						.key(function(d) { return d.countries; }).sortKeys(d3.ascending)
						.rollup(function(v) { return v.length; })
						.entries(data);
						
			
			console.log(uni);
			
			for (i=0;i<uni.length;i++)
				s.append("option").text([uni[i].key]);
	});		
	console.log("hi");

}
