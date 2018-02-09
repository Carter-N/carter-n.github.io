var windowWidth = window.innerWidth;
var windowHeight = window.innerHeight;
var graphOffset = 0;

//DOM elements
//var theta = document.getElementById("theta");
//var frequency = document.getElementById("frequency");
//var magnitude = document.getElementById("magnitude");
//var add = document.getElementById("add");
//var remove = document.getElementById("remove");

//Button events
/*add.onclick = function(){
    reset();
    circles.push({
        frequency: parseFloat(frequency.value),
        radius: parseFloat(magnitude.value),
        theta: parseFloat(theta.value)
    });
};

remove.onclick = function(){
    reset();
    circles.pop();
};*/

//Circles to draw
var circles = [
    {
        frequency: 1,
        radius: 128,
        theta: 0
    },
    {
        frequency: 2,
        radius: 64,
        theta: 0
    },
    {
        frequency: 3,
        radius: 32,
        theta: 0
    },
    {
        frequency: 4,
        radius: 16,
        theta: 0
    },
    {
        frequency: 5,
        radius: 8,
        theta: 0
    },
    {
        frequency: 6,
        radius: 4,
        theta: 0
    },
];

var buffer;
var lastPosition = {
    x: 0,
    y: 0
};

function reset(){
    buffer.background(255, 255, 255);
}

function setup(){
    //console.log(add);
    noFill();
    graph = createGraphics();
    createCanvas(windowWidth, windowHeight);
    buffer = createGraphics(windowWidth, windowHeight);
    buffer.stroke(255, 0, 0);
    angleMode(DEGREES);
}

function draw(){
    background(255);
    drawCircles();
    image(buffer, 0, 0);
}

function drawCircles(){

    var drawCircle = function(index, x, y){

        //Base case
        if(index == circles.length){

            if(lastPosition.x === 0 && lastPosition.y === 0){
                lastPosition.x = x;
                lastPosition.y = y;
                return;
            }

            //Draw point and connector
            strokeWeight(5);
            point(((windowWidth / 3) * 1.5) + frameCount % 360, y);

            strokeWeight(1);
            line(x, y, ((windowWidth / 3) * 1.5) + frameCount % 360, y);

            //Draw graph
            buffer.line(((windowWidth / 3) * 1.5) + (frameCount % 360) - 1, lastPosition.y, ((windowWidth / 3) * 1.5) + (frameCount % 360), y);

            //Draw red line of path
            buffer.strokeWeight(2);
            buffer.line(x, y, lastPosition.x, lastPosition.y);

            //Push new positions
            lastPosition.x = x;
            lastPosition.y = y;
            return;
        }

        //The current circle to draw
        var circle = circles[index];

        //Increment theta by frequency
        circle.theta += circle.frequency;

        //Draw the circle
        strokeWeight(1);
        ellipse(x, y, circle.radius * 2, circle.radius * 2);

        //Draw the point
        var pointX = x + cos(circle.theta) * circle.radius;
        var pointY = y + sin(circle.theta) * circle.radius;

        strokeWeight(5);
        point(pointX, pointY);

        //Draw line
        strokeWeight(1);
        line(x, y, pointX, pointY);

        //Draw the next circle
        index += 1;
        drawCircle(index, pointX, pointY);
    };

    //Recursivley draw circles to the canvas
    drawCircle(0, windowWidth / 3, windowHeight / 2);
}
