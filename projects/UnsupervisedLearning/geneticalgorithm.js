class GeneticAlgorithm{
    constructor(genSize, mutationRate, chrSize){
        this.genSize = genSize;
        this.mutationRate = mutationRate;
        this.chrSize = chrSize;

        this.topScore = 0;

        this.gen = [];
    }

    createGen(base){
        
        this.gen = [];

        //Randomly create controllers and games
        if(!base){
            for(var i = 0; i < this.genSize; i++){
                var chr = [];

                for(var j = 0; j < this.chrSize; j++){
                    chr.push(Math.random() * 2 - 1);
                }

                this.gen.push({chr: chr, score: 0});
            }
        }else{

            //Create a generation from a base chromosome
            for(var i = 0; i < this.genSize; i++){
                this.gen.push({chr: this.mutate(base), score: 0});
            }
        }
    }

    mutate(chr){
        for(var i = 0; i < chr.length; i++){
            if(Math.random() > this.mutationRate){
                chr[i] = Math.random() * 2 - 1;
            }
        }
        return chr;
    }

    //Evaluate the scored generation
    //Crossover top scorers
    //Create new generation
    evaluateGen(){

        //Find top two scorers
        //TODO: this algorithm is not always correct
        var first = this.gen[0];
        var second = this.gen[1];
        for(var i = 0; i < this.genSize; i++){
            if(this.gen[i].score > first.score){
                second = first;
                first = this.gen[i];
            }
        }

        this.topScore = first.score;

        //Create a new generation
        this.createGen(this.crossover(first.chr, second.chr));
    }

    //Crossover two chromosomes
    crossover(a, b){

        var child = [];

        //Two point crossover
        var lower = Math.floor(Math.random() * this.chrSize - 1);
        var upper = lower + Math.floor(Math.random()*(this.chrSize - lower));

        for(var i = 0; i < this.chrSize; i++){
            if(i > lower && i < upper){
                child.push(b[i]);
            }else{
                child.push(a[i]);
            }
        }

        return child;
    }
}