//Implementation of UCB1 strategy to obtain better results to a MAB problem
class MABAlgorithm{
	constructor(mab){
		
		//MAB to solve
		this.mab = mab;

		//Machine mean payouts
		this.payouts = [];
		this.meanPayouts = [];

		//Number of plays in each machine
		this.numberOfPlays = [];

		//Total plays
		this.plays = 0;

		//Sequence of plays to be replayed on visualization
		this.playSequence = [];
	}

	//Play all machines n times to generate baseline for algorithm
	playAllMachines(){

		for(let j = 0; j < this.mab.nMachines; j++){

			this.payouts.push([]);
			this.meanPayouts.push([]);
			this.numberOfPlays.push(0);
			
			let reward = mab.spinMachine(j);
			this.payouts[j].push(reward);
			this.numberOfPlays[j] += 1;
			this.plays += 1;
			this.playSequence.push({index: j, reward: reward});
		}
	}

	calculateMeanPayouts(){
		for(let i = 0; i < this.meanPayouts.length; i++){
			
			let sum = 0;

			for(let j = 0; j < this.payouts[i].length; j++){
				sum += this.payouts[i][j];
			}

			this.meanPayouts[i] = sum / this.payouts[i].length;
		}
	}

	indexOfMax(arr){
		console.log(arr);

		var max = arr[0];
		var maxIndex = 0;

		for(var i = 1; i < arr.length; i++){
			if(arr[i] > max){
				maxIndex = i;
				max = arr[i];
			}
		}

		return maxIndex;
	}

	//Calculate and make a play
	play(){

		//Machine number to play
		let selection = 0;

		//Calculate upper bound of machines
		let upperBounds = [];

		this.calculateMeanPayouts();

		for(let i = 0; i < this.mab.nMachines; i++){
			let meanPayout = this.meanPayouts[i];
			let playsOnMachine = this.numberOfPlays[i];
			let totalPlays = this.plays;

			let upperBound = meanPayout + Math.sqrt((2 * Math.log(totalPlays)) / playsOnMachine);
			upperBounds.push(upperBound);
		}

		selection = this.indexOfMax(upperBounds);

		//Make play and update parameters
		let reward = mab.spinMachine(selection);
		this.payouts[selection].push(reward);
		this.numberOfPlays[selection] += 1;
		this.plays += 1;
		this.playSequence.push({index: selection, reward: reward});

		return selection;
	}
}