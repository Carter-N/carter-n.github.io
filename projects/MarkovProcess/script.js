//Current wealth values
var values = [];

//Sorted copy of current wealth values
var sortedValues = [];

//Problem parameters
var nvalues = 600;
var max = 100;
var min = 0;

//Dimensions
var width = window.innerWidth;
var height = window.innerHeight;
var barwidth = width / nvalues;

//Frame counter
var f = 0;

var run = false;

//Populate with random values in range
for(var i = 0; i < nvalues; i++){
    values.push((max - min) / 2);
}

//Event listeners to handle key and mouse events
function keyTyped(){
    if(keyCode == 32){
        run = !run;
    }
}

function mousePressed(){
    if(!run)update();
}

function setup(){
    createCanvas(window.innerWidth, window.innerHeight);
}

function update(){

    for(var i = 0; i < nvalues; i++){
        
        //Randomly select a person to remove a dollar from,
        //it's also acceptable if i and j are equal (just removes a dollar then gives it back)
        var j = Math.floor(Math.random() * nvalues);

        //Check if in range then switch
        if(values[i] > 0 && values[i] < 100){
            values[i] -= 1;
            values[j] += 1;
        }
    }
    sortedValues = values.slice().sort();
}

function draw(){

    f += 1;
    background(255);

    //Update speed
    if(f % 10 == 0 && run){
        update();
    }

    //Draw wealth distribution and sorted line
    for(var i = 0; i < nvalues; i++){
        fill(0);
        stroke(0, 0, 0, 255);
        var barHeight = (values[i] / 100) * window.innerHeight;
        rect(barwidth * i, window.innerHeight - barHeight, barwidth, barHeight);

        fill(255, 0, 0);
        stroke(0, 0, 0, 0);
        barHeight = (sortedValues[i] / 100) * window.innerHeight;
        rect(barwidth * i, window.innerHeight - barHeight, barwidth, barwidth * 3);
    }
}