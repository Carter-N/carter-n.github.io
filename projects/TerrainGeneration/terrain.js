var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var RNS = 1;
var spacing = 1;

var render = function(){

	context.fillRect(0, canvas.height / 2, canvas.width, 1);

	for(var i = 0; i < canvas.width / spacing; i++){
		context.beginPath();
		context.moveTo((i * spacing) - spacing, getHeight(i - 1));
		context.lineTo((i * spacing), getHeight(i));
		context.stroke();
		//context.fillRect(i * spacing, getHeight(i), 2, 2);
	}
};

var cosineInterpolate = function(a, b, x){
	var ft = x * Math.PI;
	var f = (1 - Math.cos(ft)) * 0.5;

	return a * (1 - f) + b * f;
};

var interpolate = function(x, seed){
	var integer_X = Math.round(x);
	var fractional_X = x - integer_X;

	var v1 = smooth(integer_X, seed);
	var v2 = smooth(integer_X + 1, seed);

	return cosineInterpolate(v1, v2, fractional_X);
};

var smooth = function(x, seed){

	var neigboors = noise(x, seed) / 2 + noise(x + 1, seed) / 4 + noise(x - 1, seed) / 4;
	return neigboors;
};

var noise = function(x, seed){
	var n = Math.sin(seed++ * x) * 10000;
	return n - Math.floor(n);
};

var getHeight = function(x){

	var total = 0;
    var p = 1/16;
    var n = 32 - 1;

	for(var i = 0; i < n; i++){
		var frequency = Math.pow(2, i);
		var amplitude = Math.pow(p, i);

		total += interpolate(x * frequency, RNS) * amplitude;
	}

	return total * 50;
};

render();