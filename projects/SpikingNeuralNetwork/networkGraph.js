var width = window.innerWidth; 
var height = window.innerHeight;

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

var nodes = [];
var links = [];
var signals = [];
var decay = 0.05;

function addNode(id, bias){
	nodes.push({"id": id, e: 0, "bias": bias});
}

function addLink(src, tar, bias){
	links.push({"source": src, "target": tar, "bias": bias});
}

function addSignal(src, tar, e){
	signals.push({"source": src, "target": tar, "e": bias});
}

function update(){

	//Send signals
	for(var node of nodes){
		
		if(node.e > node.threshold){

			for(var link of links){
				if(link.src == node.id){
					addSignal(node.id, link.target, e * link.bias);
				}
			}
		}

		if(node.e >= decay)node.e -= decay;		//possible only decay if no energy is transferred from neuron
	}

	//Evaluate signals
	for(var signal of signals){
		node[signal.target].e += signal.e;
	}
}

addNode(0, 0.5);
addNode(1, 0.3);
addLink(0, 1, 0.9);

var simulation = d3.forceSimulation()
	.force("link", d3.forceLink().id(function(d){return d.id;}))
	.force("charge", d3.forceManyBody())
	.force("center", d3.forceCenter(width / 2, height / 2));

var link = svg.append("g")
	.attr("class", "links")
	.selectAll("line")
			.data(links)
		.enter().append("line")
			.attr("stroke-width", function(d){return Math.sqrt(d.value);});

var node = svg.append("g")
	.attr("class", "nodes")
	.selectAll("circle")
			.data(nodes)
		.enter().append("circle")
			.attr("r", 5)
			.call(d3.drag()
			.on("start", dragstarted)
			.on("drag", dragged)
			.on("end", dragended));

node.append("title")
	.text(function(d){return d.id;});

simulation
	.nodes(nodes)
	.on("tick", ticked);

simulation.force("link")
	.links(links);

function ticked(){
	link
	.attr("x1", function(d){return d.source.x;})
	.attr("y1", function(d){return d.source.y;})
	.attr("x2", function(d){return d.target.x;})
	.attr("y2", function(d){return d.target.y;});

	node
		.attr("cx", function(d){return d.x;})
		.attr("cy", function(d){return d.y;});
}

function dragstarted(d) {
	if (!d3.event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
}

function dragged(d) {
	d.fx = d3.event.x;
	d.fy = d3.event.y;
}

function dragended(d) {
	if (!d3.event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
}