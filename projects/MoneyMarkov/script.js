var width = 800;
var height = 500;

//First diagram
var root = d3.select("#diagram1").append("svg")
    .attr("width", width)
    .attr("height", height);

var N = 100;
var T = 10000;

var yScale = d3.scaleLinear()
        .domain([0, (T/N) * 2])
        .range([0, height]);

var people = [];
for(var i = 0; i < N; i++){
    people.push((T/N));
}

 var bars = root.selectAll("rect")
        .data(people)
    .enter()
        .append("rect")
            .attr("x", function(d, i){return (width / N) * i;})
            .attr("y", function(d, i){return height - yScale(d);})
            .attr("width", width / N)
            .attr("height", function(d, i){return yScale(d)});

var t = d3.transition()
        .duration(0.02)
        .ease(d3.easeLinear);

function randomIndexExclude(m, e){

    var n = -1;

    while(n == -1 || n == e){
        n = Math.floor(Math.random() * m);
    }

    return n;
}

function updateDistribution(){
    for(var i = 0; i < people.length; i++){
        if(people[i] != 0){
            people[i] -= 1; 
            people[randomIndexExclude(N, i)] += 1;
        }
    }
}

function update(){

    updateDistribution(); 

    root.selectAll("rect").data(people);

    root.selectAll("rect").transition(t)
        .attr("y", function(d, i){return height - yScale(d);})
        .attr("height", function(d, i){return yScale(d);}); 
                
}
setInterval(update, 2);
root.on("click", function(){
    update();
});
