//Basic vector class 
//TODO: replace with math js
class Vector{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

//Game DOM container
class GameContainer{
    constructor(id, width, height){
        this.id = id;
        this.width = width; 
        this.height = height;

        //Create element and add to the DOM
        this.canvas = document.createElement("canvas");
        this.canvas.id = this.id;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        document.getElementById("game").appendChild(this.canvas);
        
        //Expose graphics context
        this.context = this.canvas.getContext("2d");
    }
}

//Game object
class Game{
    constructor(n, m, container){
        
        //Board dimensions
        this.n = n;
        this.m = m;
        
        //Container
        this.container = container;
        this.context = this.container.context;
        
        //Snake information
        this.snake = [new Vector(1, 2)];
        this.dir = new Vector(0, 1);

        //Apple
        //TODO: Dont spawn apple on snake tiles
        this.apple = new Vector(Math.floor(Math.random() * this.n), Math.floor(Math.random() * this.m));
    }

    //Update the snake
    update(){
        var head = this.snake[this.snake.length - 1];

        //New position of head
        //TODO: return if nx == head.x || ny == head.y
        var nx = head.x + this.dir.x;
        var ny = head.y + this.dir.y;

        //Loss conditions
        if(nx > this.n || ny > this.m || nx < 0 || ny < 0){
            return false;
        }

        for(var i = 0; i < this.snake.length; i++){
            var segment = this.snake[i];
            if(nx == segment.x && ny == segment.y){
                return false;
            }
        }

        this.snake.push(new Vector(nx, ny));

        if(!(nx == this.apple.x && ny == this.apple.y)){
            this.snake.shift();
        }else{
            var randomX = Math.floor(Math.random() * this.n);
            var randomY = Math.floor(Math.random() * this.m);
            this.apple = new Vector(randomX, randomY);
        }
    }

    //Draw the board
    draw(){
        var context = this.context;

        //Dimensions
        var tileWidth = this.container.width / this.n;
        var tileHeight = this.container.height / this.m;

        context.clearRect(0, 0, this.container.width, this.container.height);
        
        for(var i = 0; i < this.snake.length; i++){
            var x = this.snake[i].x * tileWidth;
            var y = this.snake[i].y * tileHeight;

            //Draw the snake
            context.fillStyle = "black";
            context.fillRect(x, y, tileWidth - 2, tileHeight - 2);
        }
        
        //Draw the apple
        context.fillStyle = "red";
        context.fillRect(this.apple.x * tileWidth, this.apple.y * tileHeight, tileWidth - 2, tileHeight - 2);
    }
}

//Game initialization code
var container = new GameContainer("canvas", 500, 400);
var game = new Game(10, 10, container);
var controller = new NeuralNetController(game);

//Genetic algorithm
var ga = new GeneticAlgorithm(20, 0.2, controller.totalWeightSize);
ga.createGen();
var initialScore;

var cost = function(chr){
    var sum = 0;
    for(var i = 0; i < chr.length; i++){
        sum += -1 + chr[i];
    }

    return sum;
}

var t = 0;
while(t < 300){
    t++;

    if(t == 2){
        initialScore = ga.topScore;
    }

    //Assign scores
    for(var i = 0; i < ga.genSize; i++){
        ga.gen[i].score = cost(ga.gen[i].chr);
    }

    ga.evaluateGen();
}

console.log(ga.topScore - initialScore);

//Game runner
var ticks = 0;
var updateTime = 100;

//Begin drawing
var render = function(){
    ticks++;
    game.draw.bind(game);
    game.draw();

    if(ticks % updateTime == 0){

        //Neural net controller
        controller.getControllerInput();

        //Update game and check loss conditions
        game.update.bind(game);
        if(game.update()){
            console.log("Lost");
        }
    }
    requestAnimationFrame(render);
};

requestAnimationFrame(render);