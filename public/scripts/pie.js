var computeProb = function(datum, total) {
    return parseInt(datum["Total deaths"])/total
}

var piefy = function() {
    var age = parseInt($('#age').text())
    d3.json('/data/deaths.json', function(data) {
	    data = _.filter(data, function(d){ // filter data by age
		    return age >= parseInt(d["Low age"]) && age < parseInt(d["High age"]) })
	    
	    var total_deaths = _.reduce(data, function(memo, d) { return memo + parseInt(d["Total deaths"]) }, 0)
	    var w = 300,                        
	    h = 300,                            
	    r = Math.min(w, h) / 2 - 15,
	    color = d3.scale.category20(),
	    arc = d3.svg.arc().innerRadius(0).outerRadius(r);

	    var donut = d3.layout.pie()
	    .value(function(d) { return computeProb(d, total_deaths)});

	    var pie = d3.select("#pie")
	    .append("svg")
	    .data([data])
	    .attr("width", w)
	    .attr("height", h);
	    

	    var arcs = pie.selectAll("g.arc")
	    .data(donut)
	    .enter().append("g")
	    .attr("class", "arc")
	    .attr("fill-opacity", "0.7")
	    .attr("transform", "translate(" + r + "," + r + ")")
	    
	    arcs.append("path")
	    .attr("fill", function(d, i) { return color(i); })
	    .attr("d", arc)

	    arcs.append("text")
	    .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
	    .attr("dy", ".35em")
	    .attr("text-anchor", "middle")
	    .text(function(d, i) { return d.data["Cause of death"];  })
	    .attr("display", function(d) { return d.value > .10 ? null : "none"; })

	    //var arcOver = d3.svg.arc().innerRadius(0).outerRadius(r+2);

	    arcs.on("mouseover", function(d) { 
		    d3.select(this).select("path")
			.attr("fill-opacity", "1.0")
		    //			.attr("d", arcOver); 
		})
	    .on("mouseout", function(d) { 
		    d3.select(this).select("path")
			.attr("fill-opacity", "0.7")
		    //			.attr("d", arc); 
		}); 
	})

}

$(document).ready(function(){
	piefy()
    })
    