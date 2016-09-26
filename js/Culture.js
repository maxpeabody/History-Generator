/* Culture.js
IIFE as object

Represents an individual culture/small nation. 

NOTE: Previous versions had "canBeCoastal" and "isCoastal" variables
involved in the randomization of environments and borders. These have
been commented out of the code rather than wholly removed, just in case
I later find 1) a need for them and 2) a way to implement them. */
"use strict";

// if app exists use the existing copy; else create new object literal
var app = app || {};

app.Culture = function()
{
	// Constructor
	function Culture(dictionary, religion, continent/*,  canBeCoastal */)
	{
		// Create arrays to hold historical events + figures
		this.greatPeople = [];
		this.history = [];
		
		// What are the people of this culture called?
		this.randomizeName(dictionary);
		
		// What religion do they follow?
		if(religion) 
		{this.religion = religion;}
		else
		{
			this.religion = new app.Religion(dictionary, 
				Math.floor((Math.random() * 10) + 1), 1, 0);
		}
		
		// Where do they live?
		this.onBorder = false; // Not sure if I'm actually using this, currently
		this.continent = continent;
		this.homeland = this.continent.biomes[Math.floor(Math.random() * this.continent.biomes.length)];
		// this.randomizeEnvironment(canBeCoastal);
		
		// What sort of government do they have?
		this.empire = false; this.isEmperor = false; // Not in any empire by default - assigned later on!
		this.randomizeGovernment();
		this.generateNewRuler(dictionary); this.changeRulerSurname(dictionary);
		
		this.defineBorders(this.continent.cultures);
		// console.log(this.returnBorders());
		
		// Food? Art? Major industries?
		
		// Background variables relating to resolution of events, elections, and so on
		this.inGoldenAge = false;
		this.goldenAgeTracker = 0;
		this.currentRulerIsGreatPerson = false;
		
		this.isAtWar = false;
		this.allies = [];
		this.strength = 10; // placeholder value
	}
	
	// Prototype it and give it functions
	var c = Culture.prototype;
	
	/* c.returnData = function(){ 
		console.log(this.name);
	}; */
	
	// Randomly generates a name using a given dictionary
	c.randomizeName = function(dictionary)
	{
		/* RESET THE NAME TO A BLANK STRING!
		
		If not done, the name will begin with "undefined."
		If done in the constructor, "rerolls" will build on each other,
			rather than replacing each other. */
		this.name = "";
		// prioritize shorter names
		var maxrand = dictionary.length;
		var num_syllables = Math.floor((Math.random() * 3) + 2)
		if(num_syllables > 2) {num_syllables -= 1;}
		
		for(var i = 0; i < num_syllables; i++)
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
				(this.name[this.name.length - 1] == "a" || this.name[this.name.length - 1] == "e" || 
				this.name[this.name.length - 1] == "i" || this.name[this.name.length - 1] == "o" || 
				this.name[this.name.length - 1] == "u" || this.name[this.name.length - 1] == "y" ))
				{rand_syllable = rand_syllable.slice(1);}
				
			this.name += rand_syllable;
		}
		
		// Add an appropriate suffix for both the name of the people and the name of their country
		var suffix_randomizer = Math.floor((Math.random() * 4) + 1);
		var lastletter = this.name[this.name.length - 1];
		if(lastletter != "a" && lastletter != "e" && lastletter != "i" &&
			lastletter != "o" && lastletter != "u")
		{
			switch(suffix_randomizer)
			{
				case 1:
					this.countryName = this.name;
					this.name += "ese";
					break;
				case 2:
					if(lastletter != "y") {this.countryName = this.name + "y";}
						else {this.countryName = this.name; this.name = this.name.slice(1);}
					this.name += "ian";
					break;
				case 3:
					this.countryName = this.name + "land";
					this.name += "ish";
					break;
				case 4:
					if(lastletter == "s" || lastletter == "z") 
						{this.countryName = this.name + "tan"; this.name += "tani";}
					else {this.countryName = this.name + "stan"; this.name += "stani";}
					break;
				default:
					this.countryName = this.name + "a";
					break;
			}
		}
		else {this.countryName = this.name; this.name += "n";}
		// Remember to capitalize the names!
		this.name = this.name[0].toUpperCase() + this.name.slice(1);
		this.countryName = this.countryName[0].toUpperCase() + this.countryName.slice(1);
	};
	
	// Randomly determine where the culture lives
	// Since homeland is now drawn from the Continent's array of biomes, this is not in use.
	/* c.randomizeEnvironment = function(canBeCoastal)
	{
		// On a coast?
		var coastalCheck = Math.floor(Math.random() * 2);
		if(canBeCoastal && coastalCheck > 0) {this.isCoastal = true;}
		else {this.isCoastal = false;}
		// Environment
		var environmentRandomizer = Math.floor((Math.random() * 6) + 1);
		switch(environmentRandomizer)
		{
			case 1:
				this.envArticle = "in a";
				this.environment = "forest";
				break;
			case 2:
				if(this.isCoastal) {this.envArticle = "on a"; this.environment = "beach";}
				else {this.envArticle = "in a"; this.environment = "desert";}
				break;
			case 3:
				this.envArticle = "in a";
				this.environment = "vast grassland";
				break;
			case 4:
				this.envArticle = "in the";
				this.environment = "tundra";
				break;
			case 5:
				this.envArticle = "in the";
				this.environment = "mountains";
				break;
			case 6:
				this.envArticle = "in a";
				this.environment = "swamp";
				break;
			default:
				this.envArticle = "";
				this.environment = "underwater";
				break;
		}
	}; */
	
	// Randomly determine what exists on the northern, western, southern and eastern borders of the culture's nation
	c.defineBorders = function(otherCulturesOnContinent)
	{
		this.northBorder = this.defineSingleBorder(otherCulturesOnContinent, "north");
		this.southBorder = this.defineSingleBorder(otherCulturesOnContinent, "south");
		this.westBorder = this.defineSingleBorder(otherCulturesOnContinent, "west");
		this.eastBorder = this.defineSingleBorder(otherCulturesOnContinent, "east");
	};
	
	// Helper method to make defineBorders cleaner
	c.defineSingleBorder = function(otherCulturesOnContinent, borderDir)
	{
		// Check if there's another continent in the direction of this border
		var otherContinentThatWay = false;
		if((borderDir == "north" && this.continent.northBorder) || (borderDir == "south" && this.continent.southBorder) ||
			(borderDir == "west" && this.continent.westBorder) || (borderDir == "east" && this.continent.eastBorder))
			{otherContinentThatWay = true;}
		
		var border_randomizer = Math.floor((Math.random() * 8) + 1);
		var borderDef;
		switch(border_randomizer)
		{
			case 1:
			case 2: // weight this to be a little more likely than "normal" options
				if(/*this.isCoastal &&*/ !otherContinentThatWay) {borderDef = "a vast ocean"; break;}
				else /*if(this.isCoastal)*/ {borderDef = "a large sea"; break;}
			case 3:
			case 4:
			case 5: // weight this to be considerably more likely than "normal" options - IF it's valid, of course
				// Decide on another culture on the continent to border
				var cultureCheck = Math.floor(Math.random() * otherCulturesOnContinent.length);
				// If that border is invalid, reroll up to ten times - after ten, assume no valid borders exist
				var numRolls = 0;
				// If there's no other cultures on the continent, "skip ahead"
				if(!otherCulturesOnContinent[cultureCheck]) {borderDir = "nope";}
				
				borderDef == false; // If still false at end of case, moves on to the next one
				
				switch (borderDir)
				{
					case "north":
						/* We're going to need to do a couple checks to prevent any weirdness. Specifically:
						
							- Does the target culture already have something on its southern border, OTHER
								than the default "wasteland"?
							- If not, do these cultures already share an "opposite" border, creating a weird sort
								of enclosure?
								
							TECHNICALLY the latter could be the case in real life but for simplicity's sake I
								prefer to make it otherwise. Besides, in real life, a culture to your country's
								"north, west and east" would either be called "north of you" or "all around you".
								In the case of "south and west" I can accept it at least as a temporary measure.
						*/
						while(otherCulturesOnContinent[cultureCheck].southBorder &&
							otherCulturesOnContinent[cultureCheck].southBorder != "a vast, uninhabited wasteland" &&
							this.southBorder != otherCulturesOnContinent[cultureCheck].name &&
							numRolls <= 10)
						{
							var cultureCheck = Math.floor(Math.random() * otherCulturesOnContinent.length);
							numRolls++;
						}
						
						// IF we didn't run out of rolls, that's a valid border! Record it!
						if(numRolls <= 10)
						{
							borderDef = otherCulturesOnContinent[cultureCheck].countryName;
							otherCulturesOnContinent[cultureCheck].southBorder = this.countryName;
						}
						else {borderDef = false;} // If this pops up, we'll keep rolling.
						
						break;
					case "south":
						while(otherCulturesOnContinent[cultureCheck].northBorder &&
							otherCulturesOnContinent[cultureCheck].northBorder != "a vast, uninhabited wasteland" &&
							this.northBorder != otherCulturesOnContinent[cultureCheck].name &&
							numRolls <= 10)
						{
							var cultureCheck = Math.floor(Math.random() * otherCulturesOnContinent.length);
							numRolls++;
						}
						
						if(numRolls <= 10)
						{
							borderDef = otherCulturesOnContinent[cultureCheck].countryName;
							otherCulturesOnContinent[cultureCheck].northBorder = this.countryName;
						}
						else {borderDef = false;}
						
						break;
					case "west":
						while(otherCulturesOnContinent[cultureCheck].eastBorder &&
							otherCulturesOnContinent[cultureCheck].eastBorder != "a vast, uninhabited wasteland" &&
							this.eastBorder != otherCulturesOnContinent[cultureCheck].name &&
							numRolls <= 10)
						{
							var cultureCheck = Math.floor(Math.random() * otherCulturesOnContinent.length);
							numRolls++;
						}
						
						if(numRolls <= 10)
						{
							borderDef = otherCulturesOnContinent[cultureCheck].countryName;
							otherCulturesOnContinent[cultureCheck].eastBorder = this.countryName;
						}
						else {borderDef = false;}
						
						break;
					case "east":
						while(otherCulturesOnContinent[cultureCheck].westBorder &&
							otherCulturesOnContinent[cultureCheck].westBorder != "a vast, uninhabited wasteland" &&
							this.westBorder != otherCulturesOnContinent[cultureCheck].name &&
							numRolls <= 10)
						{
							var cultureCheck = Math.floor(Math.random() * otherCulturesOnContinent.length);
							numRolls++;
						}
						
						if(numRolls <= 10)
						{
							borderDef = otherCulturesOnContinent[cultureCheck].countryName;
							otherCulturesOnContinent[cultureCheck].westBorder = this.countryName;
						}
						break;
				}
				if(borderDef != false) {break;}
			case 6:
				borderDef = "a mountain range";
				break;
			case 7:
				borderDef = "a desert";
				break;
			case 8:
				borderDef = "a fertile valley";
				break;
			case 9:
				borderDef = "an unclaimed ruin from a long-lost civilization";
				break;
		}
		
		// If, after all that, the border is still undefined:
		if(!borderDef) {borderDef = "a vast, uninhabited wasteland";}
		
		return borderDef;
	};
	
	c.returnBorders = function()
	{
		return ("To the north of " + this.countryName + " lies " + this.northBorder + "; to the south, " + 
			this.southBorder + "; to the west, " + this.westBorder + "; and to the east, " + this.eastBorder + ".");
	};
	
	// Randomizes the kind of government the country operates under, and the corresponding title of its ruler.
	c.randomizeGovernment = function()
	{
		var governmentRandomizer = Math.floor((Math.random() * 8) + 1);
		switch(governmentRandomizer)
		{
			case 1:
				// This government type has multiple possible titles for the ruler!
				var titleRandomizer = Math.floor((Math.random() * 3) + 1);
				switch(titleRandomizer)
				{
					case 1: this.rulerTitle = "King"; this.rulerTitleFem = "Queen"; break;
					case 2: this.rulerTitle = "Duke"; this.rulerTitleFem = "Duchess"; break;
					case 3: this.rulerTitle = "Sultan"; this.rulerTitleFem = "Sultaness"; break;
					// If a title is gender neutral, set titleFem to "undefined"
					// Doing so ensures that the proper title will appear even if the government changes!
					case 4: this.rulerTitle = "Khan"; this.rulerTitleFem = undefined; break;
					case 5: this.rulerTitle = "Mansa"; this.rulerTitleFem = undefined; break;
					default: case 1: this.rulerTitle = "Duke"; this.rulerTitleFem = "Duchess"; break;
				}
				this.govArticle = "an";
				this.government = "absolute monarchy";
				// When does the current ruler get replaced by a new one?
				this.timeToRulerChange = Math.floor((Math.random() * 90) + 1);
				this.rulerChangeFrequency = "on death";
				this.maintainDynasty = true; // DO NOT generate new surname for ruler by default!
				break;
			case 2:
				this.rulerTitle = "Chancellor"; this.rulerTitleFem = undefined;
				this.govArticle = "an";
				this.government = "oligarchy";
				this.timeToRulerChange = this.rulerChangeFrequency = Math.floor((Math.random() * 10) + 5);
				this.numReelections = 0;
				this.maintainDynasty = false; // DO generate new surname for ruler by default!
				break;
			case 3:
				var titleRandomizer = Math.floor((Math.random() * 5) + 1);
				switch(titleRandomizer)
				{
					case 1: this.rulerTitle = "King"; this.rulerTitleFem = "Queen"; break;
					case 2: this.rulerTitle = "Duke"; this.rulerTitleFem = "Duchess"; break;
					case 3: this.rulerTitle = "Sultan"; this.rulerTitleFem = "Sultaness"; break;
					case 4: this.rulerTitle = "Khan"; this.rulerTitleFem = undefined; break;
					case 5: this.rulerTitle = "Mansa"; this.rulerTitleFem = undefined; break;
					default: case 1: this.rulerTitle = "Duke"; this.rulerTitleFem = "Duchess"; break;
				}
				this.govArticle = "a";
				this.government = "constitutional monarchy";
				this.timeToRulerChange = Math.floor((Math.random() * 90) + 1);
				this.rulerChangeFrequency = "on death";
				this.maintainDynasty = true;
				break;
			case 4:
				this.rulerTitle = "Lawkeeper"; this.rulerTitleFem = undefined;
				this.govArticle = "a";
				this.government = "direct democracy";
				this.timeToRulerChange = this.rulerChangeFrequency = Math.floor((Math.random() * 4) + 3);
				this.numReelections = 0;
				this.maintainDynasty = false;
				break;
			case 5:
				var titleRandomizer = Math.floor((Math.random() * 4) + 1);
				switch(titleRandomizer)
				{
					case 1: this.rulerTitle = "Doge"; this.rulerTitleFem = undefined; break;
					case 2: this.rulerTitle = "Stadtholder"; this.rulerTitleFem = undefined; break;
					case 3: this.rulerTitle = "Kaiser"; this.rulerTitleFem = undefined; break;
					case 4: this.rulerTitle = "Despot"; this.rulerTitleFem = undefined; break;
					default: this.rulerTitle = "Doge"; this.rulerTitleFem = undefined; break;
				}
				this.govArticle = "a";
				this.government = "noble republic";
				this.timeToRulerChange = this.rulerChangeFrequency = Math.floor((Math.random() * 10) + 5);
				this.numReelections = 0;
				this.maintainDynasty = false;
				break;
			case 6:
				this.rulerTitle = "Governor"; this.rulerTitleFem = undefined; 
				this.govArticle = "an";
				this.government = "egalitarian republic";
				this.timeToRulerChange = this.rulerChangeFrequency = Math.floor((Math.random() * 4) + 4);
				this.numReelections = 0;
				this.maintainDynasty = false;				
				break;
			case 7:
				var titleRandomizer = Math.floor((Math.random() * 4) + 1);
				switch(titleRandomizer)
				{
					case 1: this.rulerTitle = "Archbishop"; this.rulerTitleFem = undefined; break;
					case 2: this.rulerTitle = "Grandmaster"; this.rulerTitleFem = undefined; break;
					case 3: this.rulerTitle = "High Priest"; this.rulerTitleFem = "High Priestess"; break;
					case 4: this.rulerTitle = "Lama"; this.rulerTitleFem = undefined; break;
					default: this.rulerTitle = "Archbishop"; this.rulerTitleFem = undefined; break;
				}
				this.govArticle = "a";
				this.government = "theocracy";
				this.timeToRulerChange = Math.floor((Math.random() * 90) + 1);
				this.rulerChangeFrequency = "on death";
				this.maintainDynasty = false;
				break;
			case 8:
				var titleRandomizer = Math.floor((Math.random() * 6) + 1);
				switch(titleRandomizer)
				{
					case 1: this.rulerTitle = "King"; this.rulerTitleFem = "Queen"; break;
					case 2: this.rulerTitle = "Duke"; this.rulerTitleFem = "Duchess"; break;
					case 3: this.rulerTitle = "Sultan"; this.rulerTitleFem = "Sultaness"; break;
					case 4: this.rulerTitle = "Khan"; this.rulerTitleFem = undefined; break;
					case 5: this.rulerTitle = "Mansa"; this.rulerTitleFem = undefined; break;
					case 6: this.rulerTitle = "Governor-For-Life"; this.rulerTitleFem = undefined; break;
					default: case 1: this.rulerTitle = "Duke"; this.rulerTitleFem = "Duchess"; break;
				}
				this.govArticle = "an";
				this.government = "elective monarchy"; // "HRE" model - ruler for life
				this.timeToRulerChange = Math.floor((Math.random() * 90) + 1);
				this.rulerChangeFrequency = "on death";
				this.maintainDynasty = false;
				break;
		}
	};
	
	// Randomizes the ruler of the nation when called
	c.generateNewRuler = function(dictionary)
	{
		// Determine whether the ruler is a woman or not, if relevant
		// Currently, this is only used for gender-based titles (e.g. King vs Queen)
		// ADD ALTERNATE GENDERS LATER?
		if(Math.random() > 0.5 && this.rulerTitleFem) 
		{
			this.rulerIsFemale = true; 
			this.activeRulerTitle = this.rulerTitleFem;
		}
		else 
		{
			this.rulerIsFemale = false;
			this.activeRulerTitle = this.rulerTitle;
		}
		
		// Randomize the ruler's name
		this.rulerName = "";
		var maxrand = dictionary.length;
		var num_syllables = Math.floor((Math.random() * 2) + 2)
		
		for(var i = 0; i < num_syllables; i++)
		{
			var rand_syllable = Math.floor(Math.random() * maxrand)
			rand_syllable = dictionary[rand_syllable];
			
			if((rand_syllable[0] == "a" || rand_syllable[0] == "e" || 
				rand_syllable[0] == "i" || rand_syllable[0] == "o" ||
				rand_syllable[0] == "u" || rand_syllable[0] == "y") && 
				(this.rulerName[this.rulerName.length - 1] == "a" || this.rulerName[this.rulerName.length - 1] == "e" || 
				this.rulerName[this.rulerName.length - 1] == "i" || this.rulerName[this.rulerName.length - 1] == "o" || 
				this.rulerName[this.rulerName.length - 1] == "u" || this.rulerName[this.rulerName.length - 1] == "y" ))
				{rand_syllable = rand_syllable.slice(1);}
				
			this.rulerName += rand_syllable;
		}
		
		this.rulerName = this.rulerName[0].toUpperCase() + this.rulerName.slice(1);
		
		// LATER: Randomize ruler stats? - can be referenced by event
	};
	
	// Changes the surname of the ruler in office.
	// Called for republics and events.
	c.changeRulerSurname = function(dictionary)
	{
		this.rulerSurname = "";
		var maxrand = dictionary.length;
		var num_syllables = Math.floor((Math.random() * 3) + 2)
		
		for(var i = 0; i < num_syllables; i++)
		{
			var rand_syllable = Math.floor(Math.random() * maxrand)
			rand_syllable = dictionary[rand_syllable];
			
			if((rand_syllable[0] == "a" || rand_syllable[0] == "e" || 
				rand_syllable[0] == "i" || rand_syllable[0] == "o" ||
				rand_syllable[0] == "u" || rand_syllable[0] == "y") && 
				(this.rulerSurname[this.rulerSurname.length - 1] == "a" || this.rulerSurname[this.rulerSurname.length - 1] == "e" || 
				this.rulerSurname[this.rulerSurname.length - 1] == "i" || this.rulerSurname[this.rulerSurname.length - 1] == "o" || 
				this.rulerSurname[this.rulerSurname.length - 1] == "u" || this.rulerSurname[this.rulerSurname.length - 1] == "y" ))
				{rand_syllable = "-" + rand_syllable.slice(1);}
				
			this.rulerSurname += rand_syllable;
		}
		
		this.rulerSurname = this.rulerSurname[0].toUpperCase() + this.rulerSurname.slice(1);
	};
	
	// Handles elections and successions
	c.newRulerCountdown = function(dictionary)
	{
		this.timeToRulerChange -= 1;
		if(this.timeToRulerChange <= 0)
		{
			// Monarchies
			if(this.rulerChangeFrequency == "on death")
			{
				this.timeToRulerChange = Math.floor((Math.random() * 90) + 1);
				this.generateNewRuler(dictionary);
				if(!this.maintainDynasty) {this.changeRulerSurname(dictionary);}
				
				/* console.log("The old ruler is dead. Long live " + this.activeRulerTitle + " " +
					this.rulerName + " " + this.rulerSurname + "!"); */
				this.currentRulerIsGreatPerson = false;
				
				// If the ruler is the Emperor, change over!
				if(this.isEmperor) {this.empire.newRulerCountdown(dictionary, true);}
			}
			// Republics/Democracies
			// For simplicity's sake, we're assuming rulers never die in office. Might add events for that later, though.
			else
			{
				// Ruler re-elected? (2 in 5 chance for second term, steadily decreasing w/ subsequent ones)
				var reelectionCheck = Math.floor(Math.random() * (5 + (this.numReelections * 2)));
				if(reelectionCheck >= 2 || this.numReelections > 6)
				{
					this.generateNewRuler(dictionary);
					this.changeRulerSurname(dictionary);
					this.numReelections = 0;
					
					/* console.log("Hail to the new " + this.activeRulerTitle + ", " + this.rulerName +
						" " + this.rulerSurname + "!"); */
					this.currentRulerIsGreatPerson = false;
					
					// If the ruler is the Emperor, change over!
					if(this.isEmperor) {this.empire.newRulerCountdown(dictionary, false);}
				}
				else
				{
					this.numReelections++;
					
					/* console.log(this.rulerName + " " + this.rulerSurname + " was reelected as " + this.activeRulerTitle + 
						"! Number of times elected: " + (this.numReelections + 1)); */
						
					// If they were re-elected twice or more, they must be extraordinarily popular. Record it.
					if(this.numReelections > 1 && !this.currentRulerIsGreatPerson)
					{
						if(this.isEmperor)
						{
							this.greatPeople.push(this.empire.activeRulerTitle + " " + this.rulerName + " " + 
								" the Beloved");
						}
						else
						{
							this.greatPeople.push(this.activeRulerTitle + " " + this.rulerName + " " + 
								" the Beloved");
						}
						this.currentRulerIsGreatPerson = true;
					}
				}
				this.timeToRulerChange = this.rulerChangeFrequency;
			}
		}
		
		// Since this pops yearly, let's also take care of any history stuff which needs to happen non-randomly,
		// 		e.g. decrementing goldenAgeTracker.
		this.goldenAgeTracker--;
	};
	
	// Lists all existing great historical figures as a string
	c.listGreatPeople = function()
	{
		var returnString = this.greatPeople[0];
		if(this.greatPeople.length == 2)
		{
			returnString += (" and " + this.greatPeople[1]);
		}
		else if(this.greatPeople.length > 2)
		{
			for(var i = 1; i < this.greatPeople.length - 1; i++)
			{
				returnString += (", " + this.greatPeople[i]); 
			}
			returnString += (", and " + this.greatPeople[this.greatPeople.length - 1]); 
		}
		
		return (returnString + ".");
	};
	
	// Brings this country (and allies, if applicable) into a war
	// TO BE ADDED: Alliance neglect?
	// NEED TO FIGURE OUT: A good way to handle the justification for war in the historical records
	c.startWar = function(year, isAttacking, primaryAttackingCulture, primaryDefendingCulture, casusBelli)
	{
		var histString;
		if(year < 0)
		{histString = "In the year " + (year * -1) + " P.M.E., ";}
		else
		{histString = "In the year M.E. " + year + ", ";}
		
		if(this.name == primaryAttackingCulture.name || this.name == primaryDefendingCulture.name)
		{
			// If the attacker, bring the defender and attacking allies into the war
			if(this.name == primaryAttackingCulture.name)
			{
				// Break alliances with the primary defender
				for(var i = 0; i < this.allies.length; i++)
				{	if(this.allies[i].name == primaryDefendingCulture.name) {this.allies.splice(i, 1); i--;}	}
				// Call the primary defender to war (AFTER breaking any alliances, of course)
				primaryDefendingCulture.startWar(year, false, primaryAttackingCulture, primaryDefendingCulture, casusBelli);
				// Call the allies to war
				for(var i = 0; i < this.allies.length; i++)
				{this.allies[i].startWar(year, true, primaryAttackingCulture, primaryDefendingCulture, casusBelli);}
			}
			else
			{
				// Break alliances with the primary attacker
				for(var i = 0; i < this.allies.length; i++)
				{	if(this.allies[i].name == primaryAttackingCulture.name) {this.allies.splice(i, 1); i--;}	}
				/* Make sure to create history events for the allies, as well.
				
				Since attackers will already have broken alliances with the primary defender, don't have to worry about
				them getting called to war twice. */
				for(var i = 0; i < this.allies.length; i++)
				{this.allies[i].startWar(year, false, primaryAttackingCulture, primaryDefendingCulture, casusBelli);}
			}
			
			// Add the declaration of war to cultural history AFTER breaking any necessary allegiances.
			// Don't want someone to get called to war against themselves, after all.
			histString += primaryAttackingCulture.countryName;
			if(primaryAttackingCulture.allies.length == 1)
			{
				histString += (" - aided by " + primaryAttackingCulture.allies[0].countryName) + " - ";
			}
			else if(primaryAttackingCulture.allies.length > 1)
			{
				histString += (" - aided by " + primaryAttackingCulture.allies[0].countryName);
				
				for(var i = 1; i < primaryAttackingCulture.allies.length - 1; i++)
				{
					histString += (", " + primaryAttackingCulture.allies[i].countryName);
				}
				histString += (" and " + 
					primaryAttackingCulture.allies[primaryAttackingCulture.allies.length - 1].countryName + " -");
			}
			
			// Declaration of war - defender and allies
			histString += (" declared war on " + primaryDefendingCulture.countryName + ".");
			// ADD: DEFENDER'S ALLIES?
		}
		else if(isAttacking)
		{
			histString += (this.countryName + " was called on by " + primaryAttackingCulture.countryName +
				" to aid in the " + casusBelli + primaryDefendingCulture.countryName + ".");
			
			// Break alliances with the primary defender
			for(var i = 0; i < this.allies.length; i++)
			{	if(this.allies[i].name == primaryDefendingCulture.name) {this.allies.splice(i, 1); i--;}	}
		}
		else
		{
			histString += (this.countryName + " was called to defend " + primaryDefendingCulture.countryName +
				" from " + primaryAttackingCulture.name + " aggression.");
				
			// Break alliances with the primary attacker
			for(var i = 0; i < this.allies.length; i++)
			{	if(this.allies[i].name == primaryAttackingCulture.name) {this.allies.splice(i, 1); i--;}	}
		}
		
		this.history.push(histString);
	};
	
	return Culture;
}(); // end app.Culture