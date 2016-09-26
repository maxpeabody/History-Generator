/* Continent.js
IIFE as object

Tracks a continent, its location in relation to other continents,
and the environment + civilizations on it. */
"use strict";

// if app exists use the existing copy; else create new object literal
var app = app || {};

app.Continent = function()
{
	// Constructor
	function Continent(dictionary, descriptorDictionary, enviroDictionary, size)
	{
		this.size = size;
		this.numBorders = 0;
		
		this.cultures = [];
		this.biomes = [];
		this.biomesList = "";
		
		// Randomly generate a name for the continent
		this.name = "";
		// prioritize shorter names
		var maxrand = dictionary.length;
		var num_syllables = Math.floor((Math.random() * 2) + 2)
		if(num_syllables > 2) {num_syllables -= 1;}
		
		for(var i = 0; i < num_syllables; i++)
		{
			// generate a random number
			var rand_syllable = Math.floor(Math.random() * maxrand)
			// take that syllable and add it to the name
			this.name += dictionary[rand_syllable];
		}
		
		// Add an appropriate suffix
		var lastletter = this.name[this.name.length - 1];
		if(lastletter != "a" && lastletter != "e" && lastletter != "i" &&
			lastletter != "o" && lastletter != "u")
			{this.name += "ica";}
		else if(lastletter == "i")
			{this.name += "a";}
		else
			{this.name += "lia";}
		// Remember to capitalize the name!
		this.name = this.name[0].toUpperCase() + this.name.slice(1);
		
		// Generate natural features for the continent
		this.randomizeGeography(descriptorDictionary, enviroDictionary);
	}
	
	// Prototype it and give it functions
	var c = Continent.prototype;
	
	/* Given an adjacent continent and the direction it is in, records their border
	
	If "isMutual" is false, calls addBorder on the other continent (with isMutual true)
		to ensure the relationships line up right */
	c.addBorder = function(otherCont, dir, isMutual)
	{
		if(this.numBorders < 2 && otherCont.numBorders < 2 &&	// Prevent a continent from having too many borders...
			this.northBorder != otherCont && this.southBorder != otherCont &&	// Or from bordering the same continent twice.
			this.westBorder != otherCont && this.eastBorder != otherCont) 	// THERE IS PROBABLY A WAY MORE ELEGANT WAY TO CHECK THIS
		{
			/* Normally I would do this with a switch statement. However, I don't want any continents
				"sandwiched" between others, so check for that first!
			
			COULD set it up so a continent could have multiple borders on the SAME side, but that would
				vastly overcomplicate things.

			Furthermore, we need to check that either the other continent has no existing border on that
				side, OR that this one is reciprocating that very border! If we don't, mutualism will break
				down badly. */
			if(dir == "north" && !this.northBorder && !this.southBorder &&
				(!otherCont.southBorder || isMutual))
			{
					this.northBorder = otherCont; this.numBorders += 1;
					if(!isMutual) {otherCont.addBorder(this, "south", true);}
			}
			else if(dir == "south" && !this.northBorder && !this.southBorder &&
				(!otherCont.northBorder || isMutual))
			{
					this.southBorder = otherCont; this.numBorders += 1;
					if(!isMutual) {otherCont.addBorder(this, "north", true);}
			}
			else if(dir == "west" && !this.westBorder && !this.eastBorder &&
				(!otherCont.eastBorder || isMutual))
			{
					this.westBorder = otherCont; this.numBorders += 1;
					if(!isMutual) {otherCont.addBorder(this, "east", true);}
			}
			else if(dir == "east" && !this.westBorder && !this.eastBorder &&
				(!otherCont.westBorder || isMutual))
			{
					this.eastBorder = otherCont; this.numBorders += 1;
					if(!isMutual) {otherCont.addBorder(this, "west", true);}
			}
		}
	};
	
	c.listBorders = function()
	{
		var textToReturn = "";
		
		if(this.northBorder) {textToReturn += (this.northBorder.name + " lies to the north");}
		else if(this.southBorder) {textToReturn += (this.southBorder.name + " lies to the south");}
		
		if(this.numBorders == 2)
		{
			if(this.westBorder) {textToReturn += (", and " + this.westBorder.name + " lies to the west.");}
			else if(this.eastBorder) {textToReturn += (", and " + this.eastBorder.name + " lies to the east.");}
		}
		else if(this.westBorder) {textToReturn += (this.westBorder.name + " lies to the west.");}
		else if(this.eastBorder) {textToReturn += (this.eastBorder.name + " lies to the east.");}
		
		else if(this.numBorders == 0) {textToReturn = this.name + " has no land borders with any other major continent.";}
		else{textToReturn += ".";}
		
		return textToReturn;
	};
	
	// Determines major biomes & geographical features of the continent
	c.randomizeGeography = function(descriptorDictionary, enviroDictionary)
	{
		var numFeatures = Math.floor((Math.random() * 6) + 3); // 3 to 8 major features
		for(var i = 0; i < numFeatures; i++)
		{
			// Create a location from a combination of a descriptor and a type of environment
			var descriptorIndex = Math.floor(Math.random() * descriptorDictionary.length);
			var enviroIndex = Math.floor(Math.random() * enviroDictionary.length);
			// Capitalization!
			var locName = descriptorDictionary[descriptorIndex] + " " + enviroDictionary[enviroIndex];
			
			// Add the location to the "biomes" array
			this.biomes.push(locName);
		}
		
		// Create a message describing the various features of the continent
		if(this.biomes.length == 1)
		{this.biomesList = "the " + this.biomes[0];}
		else if(this.biomes.length == 2)
		{this.biomesList = "the " + this.biomes[0] + " and the " + this.biomes[1];}
		else
		{
			for(var i = 0; i < this.biomes.length - 1; i++)
			{this.biomesList += ("the " + this.biomes[i] + ", ");}
			this.biomesList += ("and the " + this.biomes[this.biomes.length - 1]);
		}
	};
	
	return Continent;
}(); // end App.Continent