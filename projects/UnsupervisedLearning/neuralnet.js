class NeuralNetwork{
    constructor(){
        this.weights = [];
    }
    
    //Create n by m matrix of random weights (0, 1)
    //TODO: Implement gaussian distribution instead of uniform
    addRandomWeightLayer(n, m){
        var weights = [];
        
        for(var i = 0; i < n; i++){
            weights.push([]);
            for(var j = 0; j < m; j++){
                weights[i].push(Math.random() * 2 - 1);
            }
        }

        this.weights.push(math.matrix(weights));
    }

    //Basic nonlinearity
    nonlin(x){
        x = x.map(function(value, index, matrix){
            return 1 / (1 + Math.exp(-value));
        });
        
        return x;
    }

    evaluate(l0){

        //L1 activations
        var l1 = this.nonlin(math.multiply(l0, this.weights[0]));

        //L2 activations
        var l2 = this.nonlin(math.multiply(l1, this.weights[1]));

        return l2;
    }
}

class NeuralNetController{
    constructor(game, chr){

        this.game = game;

        //Controller chromosome
        this.chr = chr;

        //Controller hyperparameters
        this.inputLayer = 100;       //Must be game.n * game.m
        this.hiddenLayer = 30;       //Variable length
        this.outputLayer = 4;        //Must be 1x4

        //Total weight size for genetic algorithm
        this.totalWeightSize = this.inputLayer * this.hiddenLayer + this.hiddenLayer * this.outputLayer;

        //Create weights and the nerual network
        this.nn = new NeuralNetwork();
        this.l1weights = this.nn.addRandomWeightLayer(this.inputLayer, this.hiddenLayer);
        this.l2weights = this.nn.addRandomWeightLayer(this.hiddenLayer, this.outputLayer);
    }

    //Take state of board and vectorize
    vectorizeBoard(){

        var vectorized = [];

        //Initialize to 0
        for(var i = 0; i < this.game.n * this.game.m; i++){
            vectorized.push(0);
        }
        
        //Snake segments to 1
        for(var j = 0; j < this.game.snake.length; j++){
            vectorized[this.game.snake[j].y * this.game.m + this.game.snake[j].x] = 1;
        }
        
        //Apple to 0.5
        vectorized[this.game.apple.y * this.game.m, this.game.apple.x] = 0.5;
        
        return vectorized;
    }

    //Evaluate the neural network to get the input to the game
    getControllerInput(){
        
        //Vectorize board
        var input = this.vectorizeBoard(this.game);

        //Forward propogation
        var result = this.nn.evaluate(input);

        //Softmax
        var key = 0;
        var max = 0;
        var maxI = 0;

        //Find index of max element
        result.forEach(function(value, index, matrix){
            if(value > max){
                max = value;
                maxI = index[0];
            }
        });

        //Control mapping
        if(maxI == 0){
            this.game.dir.x = 0;
            this.game.dir.y = -1;
        }else if(maxI == 1){
            this.game.dir.x = -1;
            this.game.dir.y = 0;
        }else if(maxI == 2){
            this.game.dir.x = 0;
            this.game.dir.y = 1;
        }else if(maxI == 3){
            this.game.dir.x = 1;
            this.game.dir.y = 0;
        }
    }
}