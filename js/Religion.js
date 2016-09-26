/* Religion.js
IIFE as object

Represents a particular religious tradition. 

NOTE: Currently, religions are "global" - if a change is made to it, it will apply
to all cultures following that religion! At some point, I want to look into changing
that... */
"use strict";

// if app exists use the existing copy; else create new object literal
var app = app || {};

app.Religion = function()
{
	// Constructor
	function Religion(dictionary, numMajorGods, evangelism, heresyTolerance)
	{
		this.evangelism = evangelism;
		this.heresyTolerance = heresyTolerance;
		
		// Generate gods
		// Eventually we may want a proper "God" class, but for now, names is enough!
		this.gods = [];
		for(var i = 0; i < numMajorGods; i++)
		{
			// randomly generate a name for the god
			var maxrand = dictionary.length;
			var num_syllables = Math.floor((Math.random() * 1) + 2)
			var godName = "";
			
			for(var j = 0; j < num_syllables; j++)
			{
				// generate a random number
				var rand_syllable = Math.floor(Math.random() * maxrand)
				// pick the syllable corresponding to that index in the dictionary
				rand_syllable = dictionary[rand_syllable];
				// take that syllable and add it to the name, but cut out doubled vowels, as these
				//	often lead to really weird constructions
				if((rand_syllable[0] == "a" || rand_syllable[0] == "e" || 
					rand_syllable[0] == "i" || rand_syllable[0] == "o" ||
					rand_syllable[0] == "u" || rand_syllable[0] == "y") && 
					(godName[godName.length - 1] == "a" || godName[godName.length - 1] == "e" || 
					godName[godName.length - 1] == "i" || godName[godName.length - 1] == "o" || 
					godName[godName.length - 1] == "u" || godName[godName.length - 1] == "y" ))
					{rand_syllable = rand_syllable.slice(1);}
				
				godName += rand_syllable;
			}
			
			// Add the new god to the array, remembering to capitalize their name!
			godName = godName[0].toUpperCase() + godName.slice(1);
			this.gods[i] = godName;
		}
		
		/* We may want to get fancier for religion name generation later, but
			for now, the name of their primary deity is enough */
		this.name = this.gods[0];
		
		var lastletter = this.name[this.name.length - 1];
		if(lastletter != "a" && lastletter != "e" && lastletter != "i" && lastletter != "o" && lastletter != "u")
			{this.name += "ism";}
		else if(lastletter == "i") {this.name += "sm";}
		else {this.name += "nism";}
		
		// Add a message explaining which gods they worship.
		// MAY WANT TO MAKE THIS FANCIER LATER!
		if(this.gods.length == 1)
		{this.godsList = "the god " + this.gods[0];}
		else if(this.gods.length == 2)
		{this.godsList = "the gods " + this.gods[0] + " and " + this.gods[1];}
		else
		{
			this.godsList = "the gods ";
			for(var i = 0; i < this.gods.length - 1; i++)
			{
				this.godsList += this.gods[i] + ", "
			}
			this.godsList += "and " + this.gods[this.gods.length - 1];
		}
		
		// Add a message noting how evangelical + ecumenical the religion is
		if(this.evangelism < 0)
		{this.evangelismMessage = "actively ban outsiders from converting in";}
		else if(this.evangelism <= 1)
		{this.evangelismMessage = "do not actively seek to convert others, but do not discourage those who would join their faith"}
		else
		{this.evangelismMessage = "actively proselytize and seek to convert nonbelievers"}
	
		if(this.heresyTolerance <= -0.75)
		{this.heresyToleranceMessage = "work to root out anyone who criticizes the religion or belongs to a heretical sect";}
		else if(this.heresyTolerance <= 1)
		{this.heresyToleranceMessage = "think poorly of heretics and heathens, but do not go out of their way to persecute them";}
		else
		{this.heresyToleranceMessage = "go out of their way to encourage theological debates and critique of religious texts";}
	}
	
	// Prototype it and give it functions
	var r = Religion.prototype;
	
	/* r.returnData = function(){ 
		console.log("Seeks to Convert Others? " + this.evangelism);
		console.log("Acceptance of Heretics: " + this.heresyTolerance);
		console.log("Gods: " + this.gods);
	}; */
	
	// When something about the religion is changed, handle it here and update messages accordingly
	r.updateReligion = function(newGods, modEvangelism, modHeresyTolerance)
	{
		// change the values
		if(newGods) {this.gods = newGods;}
		if(modEvangelism) {this.evangelism += modEvangelism;}
		if(modHeresyTolerance) {this.heresyTolerance += modHeresyTolerance;}
		
		// change the messages
		if(this.gods.length == 1)
		{this.godsList = "the god " + this.gods[0];}
		else if(this.gods.length == 2)
		{this.godsList = "the gods " + this.gods[0] + " and " + this.gods[1];}
		else
		{
			this.godsList = "the gods ";
			for(var i = 0; i < this.gods.length - 1; i++)
			{
				this.godsList += this.gods[i] + ", "
			}
			this.godsList += "and " + this.gods[this.gods.length - 1];
		}
		
		if(this.evangelism < 0)
		{this.evangelismMessage = "actively ban outsiders from converting in";}
		else if(this.evangelism <= 1)
		{this.evangelismMessage = "do not actively seek to convert others, but do not discourage those who would join their faith"}
		else
		{this.evangelismMessage = "actively proselytize and seek to convert nonbelievers"}
	
		if(this.heresyTolerance <= -0.75)
		{this.heresyToleranceMessage = "work to root out anyone who criticizes the religion or belongs to a heretical sect";}
		else if(this.heresyTolerance <= 1)
		{this.heresyToleranceMessage = "think poorly of heretics, but do not go out of their way to persecute them";}
		else
		{this.heresyToleranceMessage = "actively encourage theological debates and critique of religious texts";}
	};
	
	return Religion;
}(); // end App.Religion