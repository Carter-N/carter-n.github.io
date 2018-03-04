var createChart = function(){

	var width = document.getElementById("error-container").offsetWidth - 100,
		height = document.getElementById("error-container").offsetHeight - 10;

	var margin = {top: 20, right: 20, bottom: 20, left: 40},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

	var y = d3.scale.linear()
		.range([height, 0]);

	var x = d3.scale.linear()
    	.range([0, width], 0);

    var barWidth = width / errorData.length;

	var chart = d3.select(".chart")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	y.domain([0, d3.max(errorData)]);
	x.domain([0, iterations]);

	var bar = chart.selectAll("g")
			.data(errorData)
		.enter().append("g")
			.attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

	bar.append("rect")
		.attr("class", "bar")
		.attr("y", function(d) { return y(d); })
		.attr("height", function(d) { return height - y(d); })
		.attr("width", barWidth);

	var xAxis = d3.svg.axis()
	    .scale(x)
	    .orient("bottom")
	    .ticks(10, "");

	var yAxis = d3.svg.axis()
	    .scale(y)
	    .orient("left")
	    .ticks(10, "");

	chart.append("g")
		    .attr("class", "x axis")
		    .attr("transform", "translate(0," + height + ")")
		    .call(xAxis)
		.append("text")
			.attr("x", width)
			.attr("y", -6)
			.style("text-anchor", "end")
			.text("Iteration");

	chart.append("g")
			.attr("class", "y axis")
			.call(yAxis)
		.append("text")
			.attr("transform", "rotate(-90)")
			.attr("x", -10)
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Error");
};

var normalizeWeights = function(weights){

	var scale = d3.scale.linear()
		.domain([math.min(weights), math.max(weights)])
		.range([0.1, 1])

	return weights.map(function(value, index, matrix){
		return scale(value);
	});
};

var createNet = function(struct, weights){

	var normWeights = [];

	for(var w = 0; w < weights.length; w++){
		normWeights.push(normalizeWeights(weights[w]));
	}

	//log(weights[0].format());
	//log(normWeights[0].format());

	var width = document.getElementById("net-container").offsetWidth,
		height = document.getElementById("net-container").offsetHeight;

	var margin = {top: 20, right: 20, bottom: 20, left: 100},
    width = width - margin.left - margin.right,
    height = height - margin.top - margin.bottom;

    var nodeRadius = 20;
    var nextNodeYMargin = height / struct[1];
    var nodeXMargin = width / (struct.length);

	var network = d3.select(".net")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
		.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	for(var i = 0; i < struct.length; i++){

		var nodeYMargin = height / (struct[i]);

		var layer = network.append("g")
			.attr("transform", function() { return "translate(" + i * nodeXMargin + ",0)"; });

		for(var j = 0; j < struct[i]; j++){
			var node = layer.append("circle")
				.attr("r", nodeRadius)
				.attr("cy", j * nodeYMargin + 20)
				.attr("fill", "none")
				.attr("stroke", "black");

			for(var k = 0; k < struct[i + 1]; k++){
				network.append("line")
					.attr("x1", (i * nodeXMargin) + nodeRadius)
					.attr("y1", j * nodeYMargin + 20)
					.attr("x2", ((i * nodeXMargin) - nodeRadius) + (nodeXMargin))
					.attr("y2", k * nextNodeYMargin + 20)
					.attr("stroke", "black")
					.attr("stroke-width", normWeights[i]._data[j][k] * 4);
			}
		}

		nextNodeYMargin = height / struct[i + 1];
	}
};

var log = function(text){

	var el = document.getElementById("console");
	el.innerHTML += "<h5 style='margin-top: 0px; margin-bottom: 5px;'>" + text + "</h5><br>";
};