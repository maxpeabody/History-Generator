/* Empire.js
IIFE as object

Represents a nation made up of/controlling several cultures/smaller nations. */
"use strict";

// if app exists use the existing copy; else create new object literal
var app = app || {};

app.Empire = function()
{
	// Constructor
	function Empire(continent)
	{
		this.continent = continent;
		this.cultures = [];
		this.emperor;
		
		// Create arrays to hold historical events + figures
		this.greatPeople = [];
		this.history = [];
		
		// Background variables relating to resolution of events
		this.inGoldenAge = false;
	}
	
	// Prototype it and give it functions
	var e = Empire.prototype;
	
	// Adds a selected culture to the empire
	e.addCulture = function(cultureToAdd)
	{
		// First, confirm that the culture isn't already in the empire
		var isCulturePresent = false;
		for(var c in this.cultures)
		{
			if(this.cultures[c] == cultureToAdd) {isCulturePresent = true;}
		}
		// Then, if it isn't, add it!
		this.cultures.push(cultureToAdd);
		// List the removed culture as in the empire, too!
		cultureToAdd.empire = this;
	};
	
	// Removes a selected culture from the empire
	e.removeCulture = function(cultureToRemove)
	{
		for(var i = 0; i < this.cultures.length; i++)
		{if(this.cultures[i] == cultureToRemove) {this.cultures.splice(i, 1);}}
		// List the removed culture as NOT in an empire
		cultureToRemove.empire = false; cultureToRemove.isEmperor = false;
	};
	
	// Small helper method. Mainly using this so empires can be "properly randomized"
	// at simulation start, but defined/redefined by events later on.
	e.randomizeNameAndGovernment = function()
	{
		// For right now, let's assume that the first culture in the array is the emperor.
		this.cultures[0].isEmperor = true; this.emperor = this.cultures[0];
		/* Note that the randomizer doesn't go to the maximum meaningful
		"govType" value - some governments won't happen on empires generated at 
		game start, e.g. theocracies, which would need to check every constituent's
		majority religion first. */
		var governmentRandomizer = Math.floor((Math.random() * 4) + 1);
		this.newName(governmentRandomizer);
		
		// Determine the starting active title
		if(this.emperor.rulerIsFemale && this.rulerTitleFem) 
		{
			this.rulerIsFemale = true; 
			this.activeRulerTitle = this.rulerTitleFem;
		}
		else 
		{
			this.rulerIsFemale = false;
			this.activeRulerTitle = this.rulerTitle;
		}
	};
	
	// Name the empire. Defining its government also occurs here, mainly to streamline
	// 		things; if this presents an issue, it can be changed.
	// MAY WANT TO MAKE MORE IN-DEPTH/VARIABLE LATER
	// ALSO: ADD DIFFERING RULER TITLES? (e.g. "Caliph/Grandmaster/Pope")
	e.newName = function(govType)
	{
		switch(govType)
		{
			case 1:
				this.name = this.emperor.name + " Empire";
				// This government type has multiple possible titles for the ruler!
				var titleRandomizer = Math.floor((Math.random() * 3) + 1);
				switch(titleRandomizer)
				{
					case 1: this.rulerTitle = "Emperor"; this.rulerTitleFem = "Empress"; break;
					case 2: this.rulerTitle = "Tsar"; this.rulerTitleFem = "Tsarina"; break;
					case 3: this.rulerTitle = "Khagan"; this.rulerTitleFem = undefined; break;
					default: this.rulerTitle = "Emperor"; this.rulerTitleFem = "Empress"; break;
				}
				this.govArticle = "an";
				this.government = "absolute monarchy";
				// When does the ruler change?
				this.timeToRulerChange = this.emperor.timeToRulerChange; // The emperor dies when the emperor dies!
				this.rulerChangeFrequency = "on death";
				this.maintainDynasty = true; // SAME CULTURE'S ruler ascends to the throne each time!
				break;
			case 2:
				this.name = this.emperor.name + " League";
				this.rulerTitle = "Archchancellor";
				this.govArticle = "an";
				this.government = "oligarchy of constituent rulers";
				this.timeToRulerChange = this.rulerChangeFrequency = Math.floor((Math.random() * 15) + 5); 
				this.maintainDynasty = false; // RANDOMIZE what culture's ruler ascends to the throne!
				this.changeHandsFactor = 14; // How likely is it that one culture will maintain control of the empire?
				break;
			case 3:
				this.name = this.emperor.name + " Empire";
				var titleRandomizer = Math.floor((Math.random() * 3) + 1);
				switch(titleRandomizer)
				{
					case 1: this.rulerTitle = "Emperor"; this.rulerTitleFem = "Empress"; break;
					case 2: this.rulerTitle = "Tsar"; this.rulerTitleFem = "Tsarina"; break;
					case 3: this.rulerTitle = "Khagan"; this.name = this.emperor.name + " Khaganate"; break;
						this.rulerTitleFem = undefined; break;
					default: this.rulerTitle = "Emperor"; this.rulerTitleFem = "Empress"; break;
				}
				this.govArticle = "a";
				this.government = "constitutional monarchy";
				this.timeToRulerChange = this.emperor.timeToRulerChange;
				this.rulerChangeFrequency = "on death";
				this.maintainDynasty = true;
				break;
			case 4:
				this.name = this.emperor.name + " Republic";
				var titleRandomizer = Math.floor((Math.random() * 4) + 1);
				switch(titleRandomizer)
				{
					case 1: this.rulerTitle = "Emperor"; this.rulerTitleFem = "Empress"; break;
					case 2: this.rulerTitle = "Tsar"; this.rulerTitleFem = "Tsarina"; break;
					case 3: this.rulerTitle = "Khagan"; this.rulerTitleFem = undefined; break;
					case 4: this.rulerTitle = "President-for-Life"; this.rulerTitleFem = undefined; break;
					default: this.rulerTitle = "Emperor"; this.rulerTitleFem = "Empress"; break;
				}
				this.govArticle = "an";
				this.government = "elective monarchy";
				this.timeToRulerChange = this.emperor.timeToRulerChange;
				this.rulerChangeFrequency = "on death";
				this.maintainDynasty = false;
				this.changeHandsFactor = 10; // In the mold of the HRE, rule will rarely actually change hands
				break;
			case 5:
				this.name = this.emperor.name + " Confederation";
				var titleRandomizer = Math.floor((Math.random() * 2) + 1);
				switch(titleRandomizer)
				{
					case 1:	this.rulerTitle = "President"; this.rulerTitleFem = undefined; break;
					case 2: this.rulerTitle = "Prime Minister"; this.rulerTitleFem = undefined; break;
					default: this.rulerTitle = "Prime Minister"; this.rulerTitleFem = undefined; break;
				}
				this.govArticle = "a";
				this.government = "confederation";
				this.timeToRulerChange = this.rulerChangeFrequency = Math.floor((Math.random() * 4) + 2);
				this.maintainDynasty = false;
				this.changeHandsFactor = 16;
				break;
			case 6:
				var titleRandomizer = Math.floor((Math.random() * 4) + 1);
				switch(titleRandomizer)
				{
					case 1: this.rulerTitle = "Caliph"; this.rulerTitleFem = undefined; 
						this.maintainDynasty = true; this.name = this.emperor.name + " Caliphate"; break;
					case 2: this.rulerTitle = "Pope"; this.rulerTitleFem = undefined; 
						this.maintainDynasty = false; this.name = this.emperor.name + " Papacy of " +
						this.emperor.religion.name; break;
					case 3: this.rulerTitle = "Grandmaster"; this.rulerTitleFem = undefined; 
						this.maintainDynasty = false; this.name = this.emperor.name + " Knights"; break;
					case 4: this.rulerTitle = "Pharoah"; this.rulerTitleFem = undefined; 
						this.maintainDynasty = true; this.name = this.emperor.name + " Dynasty"; break;
					default: this.rulerTitle = "Prophet"; this.rulerTitleFem = "Prophetess"; 
						this.maintainDynasty = false; this.name = "Divine Empire of " + this.emperor.countryName; break;
				}
				this.govArticle = "a";
				this.government = "theocratic empire"
				this.timeToRulerChange = this.emperor.timeToRulerChange;
				this.rulerChangeFrequency = "on death";
				this.changeHandsFactor = 50; // An elective theocracy should almost always change hands
				break;
			default:
				this.name = this.emperor.name + " Alliance";
				this.rulerTitle = "Warchief"; this.rulerTitleFem = undefined; break;
				this.govArticle = "a";
				this.government = "temporary and poorly-defined confederation";
				this.timeToRulerChange = Math.floor((Math.random() * 90) + 1);
				this.rulerChangeFrequency = "on death";
				this.maintainDynasty = false;
				break;
		}
	};
	
	// Handles elections and successions
	e.newRulerCountdown = function(dictionary, emperorIsDead)
	{
		// If the emperor dies, bring in the new ruler
		if(emperorIsDead)
		{
			if(!this.maintainDynasty) // Rule can change hands...
			{
				// ...but does it actually?
				if(Math.random() * this.changeHandsFactor >= 6)
				{
					this.emperor.isEmperor = false;
					var newRulingCulture = Math.floor(Math.random() * this.cultures.length);
					this.emperor = this.cultures[newRulingCulture]; this.emperor.isEmperor = true;
				}
			}
		}
		// If the emperor ISN'T dead, only change over for republics!
		else if(this.rulerChangeFrequency != "on death")
		{
			if(Math.random() * this.changeHandsFactor >= 6)
			{
				this.emperor.isEmperor = false;
				var newRulingCulture = Math.floor(Math.random() * this.cultures.length);
				this.emperor = this.cultures[newRulingCulture]; this.emperor.isEmperor = true;
			}
		}
		
		// Now that we've decided what COUNTRY rules the empire, fill in the relevant information for the emperor
		this.rulerName = this.emperor.rulerName; this.rulerSurname = this.emperor.rulerSurname;
		// Determine whether the ruler is a woman or not, if relevant
		// Currently, this is only used for gender-based titles (e.g. King vs Queen)
		// ADD ALTERNATE GENDERS LATER?
		if(this.emperor.rulerIsFemale && this.rulerTitleFem) 
		{
			this.rulerIsFemale = true; 
			this.activeRulerTitle = this.rulerTitleFem;
		}
		else 
		{
			this.rulerIsFemale = false;
			this.activeRulerTitle = this.rulerTitle;
		}
	};
	
	// Lists constituent nations as a string
	e.listCultures = function()
	{
		var returnString = "";
		if(this.cultures.length == 1)
		{	returnString = ("The only nation in the " + this.name + " is " + this.cultures[0].countryName + ".");	}
		else
		{
			returnString = ("The nations that make up the " + this.name + " are ");
			for(var i = 0; i < this.cultures.length - 1; i++)
			{	returnString += (this.cultures[i].countryName + ", ");}
			returnString += (" and " + this.cultures[this.cultures.length - 1].countryName + ".");
		}
		
		return returnString;
	};
	
	return Empire;
}(); // end app.Empire