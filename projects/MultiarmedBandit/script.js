//Slot machines give a fixed reward based on a fixed probability
class SlotMachine{
	
	constructor(reward, rewardChance){
		this.reward = reward;
		this.rewardChance = rewardChance;
	}

	//"Spin" the machine and return reward if chance condition is met
	spin(){
		let r = Math.random();

		if(r < this.rewardChance){
			return this.reward;
		}

		return 0;
	}
}

//General multiarmed bandit problem with a constant number of machines and possible plays
class MAB{

	constructor(nMachines, nPlays){
		this.nMachines = nMachines;
		this.nPlays = nPlays;

		//Container for slot machine objects
		this.slotMachines = [];

		//Store reward accumulated by machines
		this.accumulatedReward = 0;

		this.generateMachines();
	}

	//Spin a machine and return generated reward
	spinMachine(i){
		let reward = this.slotMachines[i].spin();

		//Accumulate reward and decrement plays
		this.accumulatedReward += reward;
		this.plays -= 1;

		return reward;
	}

	//Create n machines with random parameters
	generateMachines(){
		for(let i = 0; i < this.nMachines; i++){

			//Reward value can be changed without affecting results
			let reward = Math.round(Math.random() * 100);

			//Reward chance should be between 0 and 1
			let rewardChance = Math.random();
			
			let slotMachine = new SlotMachine(reward, rewardChance);
			this.slotMachines.push(slotMachine);
		}
	}
}

//Global MAB instance
var nMachines = 5;
var plays = 60;
var mab = new MAB(nMachines, plays);

//Algorithm instance
var algorithm = new MABAlgorithm(mab);

//Algorithm plays
for(var i = 0; i < 3; i++){
	algorithm.playAllMachines();
}
//Generate play sequence
for(var i = 0; i < 50; i++){
	algorithm.play();
}

//Play sequence
var seq_i = 0;
var seq_length = algorithm.playSequence.length;
d3.interval(function(){
	if(seq_i < seq_length){
		playMachine(algorithm.playSequence[seq_i].index, algorithm.playSequence[seq_i].reward);
		seq_i ++;
	}
}, 500);