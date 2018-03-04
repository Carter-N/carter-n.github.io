//Utility function to update a specific text object
let updateText = function(textObject, text){
	textObject.text(text);
}

//Visually play a machine
let playMachine = function(machineIndex, reward){

	//Update text with correct information
	updateText(playsRemainingText, mab.nPlays + " plays remaining");
	updateText(rewardText, mab.accumulatedReward + "$");

	//Visually show if reward was gained or not
	let machine = d3.selectAll(".machine")
		.each(function(d, i){
			if(i == machineIndex){	
				let machine = d3.select(this);

				machine.interrupt();
				machine.attr("fill-opacity", 0.6)

				if(reward != 0){
					machine.attr("fill", "green");
				}else{
					machine.attr("fill", "red");
				}

				machine.transition()
					.attr("fill", "black")
					.attr("fill-opacity", 0.1)
					.duration(500);
			}
		});
}

//Dimensions
let width = 1000;
let height = 600;
let margin = 25;
let boxDim = width / nMachines;

//SVG container
let svg = d3.select("#machines").append("svg")
	.attr("width", width)
	.attr("height", height);

//Machines
let machines = svg.selectAll("rect")
		.data(mab.slotMachines)
	.enter()
		.append("rect")
			.attr("class", "machine")
			.attr("fill", "black")
			.attr("fill-opacity", 0.1)
			.attr("stroke", "black")
			.attr("width", boxDim - (2 * margin))
			.attr("height", boxDim - (2 * margin))
			.attr("x", function(d, i){
				return margin + i * 200;
			})
			.attr("y", height / 2 - boxDim / 2)
			.on("mouseover", function(){
				d3.select(this).attr("stroke-width", 5);
			})
			.on("mouseout", function(){
				d3.select(this).attr("stroke-width", 1);
			})
			.on("mousedown", function(d, i){
				
				if(mab.plays <= 0){

					//Problem finished, display statistics
					return;
				}

				//Generate reward from clicked machine
				let reward = mab.spinMachine(i);

				playMachine(i, reward);
			});

//Reward text
let rewardText = svg.append("text")
	.attr("x", width / 2)
	.attr("y", 150)
	.attr("text-anchor", "middle")
	.style("font-size", 30)
	.text("0$");

//Plays remaining text
let playsRemainingText = svg.append("text")
	.attr("x", width / 2)
	.attr("y", 50)
	.attr("text-anchor", "middle")
	.style("font-size", 30)
	.text("");

updateText(playsRemainingText, mab.nPlays + " plays remaining");