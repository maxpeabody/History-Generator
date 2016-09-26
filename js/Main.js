/* Main.js

The main class, which will handle most or all user input & actual
processing. */

"use strict";

// if app exists use the existing copy; else create new object literal
var app = app || {};

app.Main = 
{
	// Declare variables
	// Holds syllables for random generation of names
	dictionary: ["en", "ha", "pon", "aus", "ten", "shi", "kon", "ron",
		"ma", "cio", "ven", "rus", "nor", "er", "ica", "nez", "ivia",
		"be", "la", "gre", "bri", "sco", "nov", "ral", "ayu", "ma",
		"chu", "tur", "bela", "op", "ca", "val", "nis", "tus", "gen",
		"itz", "inz", "er", "tan", "cas", "ara", "ata", "por"],
	// Holds types of environment (e.g. forest, desert) and descriptors to apply to them
	enviroTypeDictionary: ["Forest", "Beach", "Desert", "Peninsula", "Archipelago", 
		"Highlands", "Lowlands", "Swamp", "Plains", "Steppes", "Tundra", 
		"Canyon", "Valley", "Wastes", "Mountains", "Caverns", "Savannah",
		"Rainforest", "Jungle", "Woods", "Moor", "Bog", "Prairie", "Fjords",
		"Plateau", "Trench", "Vineyards"],
	enviroDescriptorDictionary: ["Gleaming", "Violet", "Black", "Red", // "<Adjective> Location"
		"Blue", "Technicolor", "Golden", "Bloody", "Dead Man's", "Sun-Baked", "Fruitful",
		"Lunar", "Sacred", "Forsaken", "Skeletal", "Lovely", "Ancient",
		"Underground", "Floating", "Mystical", "Forbidden", "Cursed",
		"Space-Warped", "Eternal", "Flooded", "Royal", "Haunted", "Hidden",
		"Melting", "Smoldering"],
	
	// Arrays of cultures, empires, continents, religions, etc.
	continents: [],
	cultures: [],
	religions: [],
	empires: [],
	
	// Variables related to the passage of time
	year: 0,
	worldHistory: [],
	histString: "",
	
	// Smaller technical stuff can go here
	
	// initialization
	init: function()
	{
		console.log("Initializing...");
		
		// Hook up event listeners
		// User input (number of cultures/continents fields, reroll buttons)
		document.getElementById("btn_NewCultureSet").addEventListener("click",
			function() {app.Main.generateNewCultures();});
		document.getElementById("input_NumCultures").addEventListener("input",
			function() {app.Main.numCulturesCheck();});

		document.getElementById("btn_NewContinentSet").addEventListener("click",
			function() {app.Main.generateNewContinents();});
		document.getElementById("input_NumContinents").addEventListener("input",
			function() {app.Main.numContinentsCheck();});
			
		document.getElementById("btn_GenerateHistory").addEventListener("click",
			function() {app.Main.generateHistory();});
		document.getElementById("input_YearsPerTurn").addEventListener("input",
			function() {app.Main.yearsPerTurnCheck();});
		
		// Generate a list of continents
		// Doing so will automatically generate new cultures/empires as well
		this.generateNewContinents();
		
		this.listCultures();
		
		console.log("Initialization complete.");
	},
	
	// "LIST" FUNCTIONS
	// Writes out all the data from a set of objects to a corresponding <div>
	listContinents: function()
	{
		// Erase the existing continent list, if there is one
		document.getElementById("Continents").innerHTML = "";
		// Replace it with the new one
		for(var i = 0; i < this.continents.length; i++)
		{
			document.getElementById("Continents").innerHTML += ("<p>" + this.continents[i].name +
				" is " + this.continents[i].size + " million square miles in area. This represents " +
				Math.floor(this.continents[i].proportionLandOnPlanet * 100) + 
				"% of all land on the planet. Notable features of " + this.continents[i].name +
				" include " + this.continents[i].biomesList + ".</p><p>" +
				this.continents[i].listBorders() + "</p>");
			
			if(i + 1 < this.continents.length) {document.getElementById("Continents").innerHTML += "<br />"}
		}
	},
	
	listCultures: function()
	{
		// Erase the existing culture list, if there is one
		document.getElementById("Cultures").innerHTML = "";
		// Replace it with the new one
		for(var i = 0; i < this.cultures.length; i++)
		{
			if(this.cultures[i].greatPeople.length > 0)
			{
				document.getElementById("Cultures").innerHTML += 
				/* ("<div data-role=\"main\" class=\"ui-content\">" +
				"<div data-role=\"collapsible\"><h1>Example</h1><p id=\"example\">I'm the expanded content.</p></div></div>"); */
				// Primary cultural summary
				("<u><h4>" + this.cultures[i].countryName + "</h4></u><p>The " + this.cultures[i].name +
					" people originally hail from the " + this.cultures[i].homeland +
					" on the continent of " + this.cultures[i].continent.name + 
					". " + this.cultures[i].returnBorders());
				if(this.cultures[i].empire && !this.cultures[i].isEmperor) 
				{document.getElementById("Cultures").innerHTML += (this.cultures[i].countryName + 
					" is a member of the " + this.cultures[i].empire.name + ".");}
				else if(this.cultures[i].isEmperor)
				{document.getElementById("Cultures").innerHTML += ("The " + this.cultures[i].name + 
					" people currently control the " + this.cultures[i].empire.name + ".");}
				document.getElementById("Cultures").innerHTML += ("</p><p> They mostly follow the religion " + this.cultures[i].religion.name + 
					", worshipping " + this.cultures[i].religion.godsList + ". They " +
					this.cultures[i].religion.evangelismMessage + ", and " + 
					this.cultures[i].religion.heresyToleranceMessage + ". Their government is " + 
					this.cultures[i].govArticle + " " + this.cultures[i].government + 
					", and the current " + this.cultures[i].activeRulerTitle + " is " + this.cultures[i].rulerName + 
					" " + this.cultures[i].rulerSurname + ".</p><p> Notable " + this.cultures[i].name + 
					" figures include " + this.cultures[i].listGreatPeople() + "</p><br />");
				// History summary
				if(this.cultures[i].history.length > 0)
				{
					document.getElementById("Cultures").innerHTML += "<u>Major Events in " + this.cultures[i].name + " History</u><ul>";
	
					for(var j = 0; j < this.cultures[i].history.length; j++)
					{
						document.getElementById("Cultures").innerHTML += ("<li>" +
							this.cultures[i].history[j] + "</li>");
					}
					
					document.getElementById("Cultures").innerHTML += "</ul>";
				}
			}
			else
			{
				document.getElementById("Cultures").innerHTML += 
				/* ('<div data-role="main" class="ui-content">' +
				'<div data-role="collapsible"><h1>Example</h1><p>I\'m the expanded content.</p></div></div>'); */
				// Primary cultural summary
				("<u><h4>" + this.cultures[i].countryName + "</h4></u><p>The " + this.cultures[i].name +
					" people originally hail from the " + this.cultures[i].homeland +
					" on the continent of " + this.cultures[i].continent.name + 
					". " + this.cultures[i].returnBorders());
				if(this.cultures[i].empire && !this.cultures[i].isEmperor) 
				{document.getElementById("Cultures").innerHTML += (this.cultures[i].countryName + 
					" is a member of the " + this.cultures[i].empire.name + ".");}
				else if(this.cultures[i].isEmperor)
				{document.getElementById("Cultures").innerHTML += ("The " + this.cultures[i].name + 
					" people currently control the " + this.cultures[i].empire.name + ".");}
				document.getElementById("Cultures").innerHTML += ("</p><p> They mostly follow the religion " + this.cultures[i].religion.name + 
					", worshipping " + this.cultures[i].religion.godsList + ". They " +
					this.cultures[i].religion.evangelismMessage + ", and " + 
					this.cultures[i].religion.heresyToleranceMessage + ". Their government is " + 
					this.cultures[i].govArticle + " " + this.cultures[i].government + 
					", and the current " + this.cultures[i].activeRulerTitle + " is " + this.cultures[i].rulerName + 
					" " + this.cultures[i].rulerSurname + ". No notable " + 
					this.cultures[i].name + " figures are known." + "</p><br />");
				// History summary
				if(this.cultures[i].history.length > 0)
				{
					document.getElementById("Cultures").innerHTML += "<u>Major Events in " + this.cultures[i].name + " History</u><ul>";
	
					for(var j = 0; j < this.cultures[i].history.length; j++)
					{
						document.getElementById("Cultures").innerHTML += ("<li>" +
							this.cultures[i].history[j] + "</li>");
					}
					
					document.getElementById("Cultures").innerHTML += "</ul>";
				}
			}
			// console.log(this.cultures[i].greatPeople);
			
			if(i + 1 < this.cultures.length) {document.getElementById("Cultures").innerHTML += "<br />";}
		}
	},
	
	listEmpires: function()
	{
		// Erase the existing empire list, if there is one
		document.getElementById("Empires").innerHTML = "";
		// Replace it with the new one
		for(var i = 0; i < this.empires.length; i++)
		{
			// Primary imperial summary
			document.getElementById("Empires").innerHTML += ("<p><strong>The " + this.empires[i].name +
				"</strong> is " + this.empires[i].govArticle + " " + this.empires[i].government + " centered in " +
				this.empires[i].continent.name + ". " + this.empires[i].listCultures() + 
				" The reigning " + this.empires[i].activeRulerTitle +
				" is " + this.empires[i].emperor.activeRulerTitle + " " + this.empires[i].emperor.rulerName + 
				" of " + this.empires[i].emperor.countryName + ".</p>");
				
			// History summary
			if(this.empires[i].history.length > 0)
			{
				document.getElementById("Empires").innerHTML += "<u>Major Events in the History of the " + this.empires[i].name + "</u><ul>";
		
				for(var j = 0; j < this.empires[i].history.length; j++)
				{
					document.getElementById("Empires").innerHTML += ("<li>" +
						this.empires[i].history[j] + "</li>");
				}
				
				document.getElementById("Empires").innerHTML += "</ul>";
			}
				
			if(i + 1 < this.empires.length) {document.getElementById("Empires").innerHTML += "<br />";}
		}
	},
	
	// Lists only GLOBAL events
	listWorldHistory: function()
	{
		// List the current year.
		if(this.year < 0)
		{document.getElementById("WorldHistory").innerHTML = "<b><u>The current year is " + 
			(this.year * -1) + " P.M.E.</b></u><br/>";}
		else
		{document.getElementById("WorldHistory").innerHTML = "<b><u>The current year is M.E. " + this.year + 
			".</b></u><br/>";}
		
		// Write out the events of world history
		for(var i = 0; i < this.worldHistory.length; i++)
		{
			// This version works with events as objects instead of strings.
			// Probably unnecessary, but keep it around just in case!
			/* if(this.worldHistory[i].year < 0)
			{document.getElementById("WorldHistory").innerHTML += "<p>In the year " + 
				(-1 * this.worldHistory[i].year) + " P.M.E., ";}
			else {document.getElementById("WorldHistory").innerHTML += "<p>In the year M.E. " + 
				this.worldHistory[i].year + ", ";} 
			
			document.getElementById("WorldHistory").innerHTML += this.worldHistory[i].description +
				"</p>"; */
			
			/* Note that we're copying the worldHistory events to a string. This is to avoid re-recording the
			same events every time this batch of code is run; since records can't be meaningfully "interacted
			with" (except by erasure or revisionism, but let's assume an omniscient viewpoint), they don't NEED
			to be objects for very long. */
			this.histString += "<p>" + this.worldHistory[i] + "</p>";
			// if(i + 1 < this.worldHistory.length) {this.histString += "<br/>";}
		}
		// Once all that's done, we clear the now-recorded events from this.worldHistory, 
		//	display histString, and move on!
		this.worldHistory = [];
		document.getElementById("WorldHistory").innerHTML += this.histString;
	},
	
	// TO BE ADDED: "listCulturalHistory" and possibly a "listEmpireHistory" method?
	
	// "GENERATE" FUNCTIONS
	// Creates a fresh set of objects of the given type
	// CURRENTLY RELIGION IS RANDOMLY CHOSEN FOR EACH - CHANGE THIS LATER!
	generateNewCultures: function()
	{
		var numCultures = document.getElementById("input_NumCultures").value;
		// If the number of cultures changes, the way they're spread across continents must also change!
		this.apportionCultures();
		// Clear out array
		this.cultures = [];
		
		// Create a set of religions. To start with, each culture will have their own polytheistic religion.
		// Later, religions can become "shared" through war and other events.
		this.religions = [];
		for(var i = 0; i < numCultures; i++)
		{
			// The new religion will have 3 to 8 major gods, -1 (actively bans conversion) to 3 evangelism,
			// and -2 to 3 tolerance of heresy + sects
			this.religions.push(new app.Religion(this.dictionary, Math.floor((Math.random() * 6) + 3), 
				Math.floor((Math.random() * 4.5) - 0.75), Math.floor(Math.random() * 5) - 2));
		}
		
		// Generate specified number of cultures
		for(var i = 0; i < numCultures; i++)
		{
			// Distribute proportionally among the existing continents.
			// I'm not sure this is the best way to go about it, but it seems to work well enough?
			// Could stand for some randomization, though. Look back at this later.
			for(var j = 0; j < this.continents.length; j++)
			{
				if(Number(this.continents[j].minCultureIndex) <= i && i <= Number(this.continents[j].maxCultureIndex))
				{
					// Since one religion is generated per culture, no need to bother with random selection
					// Create the new culture, assigning it to the global + continental culture arrays
					var newCulture = new app.Culture(this.dictionary, this.religions[i], 
						this.continents[j]/*, true*/);
					this.cultures.push(newCulture);
					this.continents[j].cultures.push(newCulture);
				}
			}
		}
		// TESTING - edit religions individually
		// (currently doesn't work because pointers are weird and clunky)
		/* this.cultures[0].religion.updateReligion(undefined, 10, -10)
		this.cultures[1].religion = this.cultures[0].religion;
		this.cultures[1].religion.updateReligion(undefined, -30, 30) */
		
		// With new cultures, empires have to be revised as well!
		this.generateNewEmpires();
		
		// Finally, reset history
		// Randomize the starting year
		// this.year = Math.floor((Math.random() * 40) + 25) * -100; 
		this.year = Math.floor((Math.random() * 10) + 5) * -100; 	// starts "Pre-Common", equivalent of BC/BCE
		// Create the first batch of history
		this.worldHistory = []; this.histString = "";
		this.generateHistory();
		
		// Show the list on the page
		this.listCultures();
	},
	
	generateNewContinents: function()
	{
		var numContinents = document.getElementById("input_NumContinents").value;
		/* All the land on the planet.
		Most of this is going to come from the continents, but a little won't, so let's add
		that little bit right now! */
		var totalLandSpace = Number(((Math.random() * 0.65) + 0.75).toFixed(3));
		// Clear out array
		this.continents = [];
		// Generate specified number of continents
		for(var i = 0; i < numContinents; i++)
		{
			/* Randomize the size!
			
			NOTE: Australia is 2.97 million sq. miles, Africa 11.67, so we're going
			to keep continents roughly within that range.
			Also, once again, we have to explicitly cast to Number, because even though
			I love JavaScript it is a RIDICULOUS LANGUAGE */
			var continentSize = Number(((Math.random() * 13) + 2.25).toFixed(3));
			this.continents.push(new app.Continent(this.dictionary, this.enviroDescriptorDictionary,
				this.enviroTypeDictionary, continentSize));
			// add the size to our totalLandSpace
			totalLandSpace += continentSize;
		}
		// Now we want to figure out what PROPORTION OF LAND ON THE PLANET each continent has
		for(var i = 0; i < numContinents; i++)
		{this.continents[i].proportionLandOnPlanet = this.continents[i].size / totalLandSpace;}
		// Figure out how many cultures each continent has
		this.apportionCultures();
		
		// Now that THAT'S all done, let's generate borders!
		if(numContinents > 1) // Without this, 1-continent worlds can get trapped in a loop
		{
			for(var i = 0; i < numContinents; i++)
			{
				// Randomly select a continent + a border to share with it
				var whatBorder = Math.floor((Math.random() * 3) + 1);
				var whatContinent = Math.floor(Math.random() * numContinents);
				// Rerandomize if the continent would border itself
				while(whatContinent == i)
				{
					whatContinent = Math.floor(Math.random() * numContinents);
				}
			
				/* Add the border
			
				The addBorder method will check for excessive borders, as well as making sure
					borders are mutual. */
				switch(whatBorder)
				{
					case 1:
						this.continents[i].addBorder(this.continents[whatContinent], "north", false);
						break;
					case 2:
						this.continents[i].addBorder(this.continents[whatContinent], "south", false);
						break;
					case 3:
						this.continents[i].addBorder(this.continents[whatContinent], "west", false);
						break;
					case 4:
						this.continents[i].addBorder(this.continents[whatContinent], "east", false);
						break;
					default:
						console.log("YOU FUCKED UP THE MATH, CLOWNBAG");
						break;
				}
			}
		}
		
		// Since land distribution changes as a result, generate new cultures as well
		this.generateNewCultures();
		
		// Show the list on the page
		// This happens AFTER culture generation so the continent blurb can reference culture data
		this.listContinents();
	},
	
	generateNewEmpires: function()
	{
		this.empires = [];
		/* It's very important that we clear out the continents' "assigned empires" here.
		
		Because of the code structure, not doing so means the program thinks "oh, this
		continent already has an empire (which no longer actually exists); I'll look
		again!" forever. */
		for(var i = 0; i < this.continents.length; i++)
		{this.continents[i].empire = undefined;}
		
		var empiresToGenerate = Math.floor(((Math.random() * 5) + 5) / 10 * 
			document.getElementById("input_NumContinents").value + 0.35); // ROUGHLY (0.5-1.0 * num continents), rounded down
		
		for(var i = 0; i < empiresToGenerate; i++)
		{
			// First, choose a continent for the empire to be on.
			// We want to make sure there's only one empire on any given continent, at least to start!
			var validContinentChosen = false;
			var contOfEmpire;
			while(!validContinentChosen)
			{
				// Randomly choose a continent to assign this empire to
				contOfEmpire = this.continents[Math.floor(Math.random() * this.continents.length)];
				validContinentChosen = true;
				
				// If the continent is "in use," loop!
				if(contOfEmpire.empire) {validContinentChosen = false;}
			}
			// Once we're out of the loop, we know the continent chosen will work. Move on!
			
			var newEmpire = new app.Empire(contOfEmpire);
			this.empires.push(newEmpire); 
			newEmpire.continent.empire = newEmpire; // Marks the continent as "in use!"
		}
		
		// Assign cultures to empires and name them
		for(var i = 0; i < this.empires.length; i++)
		{
			// For each culture on the continent, randomly decide whether to assign
			// it to the empire or not
			var contCultureArray = this.empires[i].continent.cultures;
			
			for(var j = 0; j < contCultureArray.length; j++)
			{
				/* The randomization is based off of how many cultures are already in the empire.
				
				Because of this, it becomes less likely that already-huge empires will get even
				bigger; at the same time, extra-small "empires" won't be too likely, either. 
				
				May want to tweak the formula to make it "feel better", but for now this should work. */
				var randAddToEmp = Math.floor(Math.random() * this.empires[i].cultures.length);
				if(randAddToEmp == 0)
					{this.empires[i].addCulture(contCultureArray[j]);}
			}
			// Finally, name the empire and determine its government and starting ruler
			this.empires[i].randomizeNameAndGovernment();
		}
		
		// Shows the list on the page
		this.listEmpires();
	},
	
	// "REROLL NAME" FUNCTIONS
	// Changes the names of objects in an existing data set, but nothing else
	// Removed because getting it to work properly would be a lot of effort for minimal gain
	/* rerollCultureNames: function()
	{
		for(var i = 0; i < this.cultures.length; i++) 
			{this.cultures[i].randomizeName(this.dictionary);}
		this.listCultures();
	}, */
	
	// "NUM CHECK" FUNCTIONS
	// Keep the number of objects (of a given type) to be generated w/i bounds
	numCulturesCheck: function()
	{
		var inputCheck = document.getElementById("input_NumCultures");
		// Even though the input is typed as a number, it seems to be stored as a string sometimes, which causes issues?
		// Because of this, inputCheck.value needs to be EXPLICITLY CAST AS A NUMBER to avoid Problems
		if(Number(inputCheck.value) < inputCheck.min) {inputCheck.value = inputCheck.min;}
		else if(Number(inputCheck.value) > inputCheck.max) {inputCheck.value = inputCheck.max;}
		else {inputCheck.value = Number(inputCheck.value);}
		// We also want to make sure that every continent has at least two cultures on it, partly to
		// 		make the world more interesting and "real" and partly to prevent weirdness with empires.
		if(Number(inputCheck.value) < 2 * Number(document.getElementById("input_NumContinents").value))
		{document.getElementById("input_NumContinents").value = Math.floor(0.5 * inputCheck.value);}
	},
	
	numContinentsCheck: function()
	{
		var inputCheck = document.getElementById("input_NumContinents");
		if(Number(inputCheck.value) < inputCheck.min) {inputCheck.value = inputCheck.min;}
		else if(Number(inputCheck.value) > inputCheck.max) {inputCheck.value = inputCheck.max;}
		else {inputCheck.value = Number(inputCheck.value);}
		// Make sure the number of continents doesn't go over 1/2 the number of cultures!
		if(Number(inputCheck.value) > 0.5 * Number(document.getElementById("input_NumCultures").value))
		{document.getElementById("input_NumCultures").value = 2 * inputCheck.value;}
	},
	
	yearsPerTurnCheck: function()
	{
		var inputCheck = document.getElementById("input_YearsPerTurn");
		if(Number(inputCheck.value) < inputCheck.min) {inputCheck.value = inputCheck.min;}
		else if(Number(inputCheck.value) > inputCheck.max) {inputCheck.value = inputCheck.max;}
		else {inputCheck.value = Number(inputCheck.value);}
	},
	
	// assorted other functions
	apportionCultures: function()
	{
		var numContinents = document.getElementById("input_NumContinents").value;
		var numCultures = document.getElementById("input_NumCultures").value;
		this.continents[0].minCultureIndex = 0;
		this.continents[0].maxCultureIndex = Math.floor(numCultures * this.continents[0].proportionLandOnPlanet);
			
		for(var i = 1; i < numContinents; i++)
		{
			this.continents[i].minCultureIndex = this.continents[i - 1].maxCultureIndex + 1;
			this.continents[i].maxCultureIndex =
				Math.floor(numCultures * this.continents[i].proportionLandOnPlanet +
					this.continents[i - 1].maxCultureIndex);
				
			// Catch out some errors which only occur rarely, but which I have seen occur
			// If the maximum index is LESS THAN the minimum index, raise it
			if(this.continents[i].minCultureIndex > this.continents[i].maxCultureIndex)
			{this.continents[i].maxCultureIndex = this.continents[i].minCultureIndex;}
		
			// If the maximum index of THE LAST continent is less than the total number of cultures
			// (adjusted by 1, because of how arrays work), raise it
			if((i + 1 >= numContinents) && this.continents[i].maxCultureIndex < numCultures - 1)
			{this.continents[i].maxCultureIndex = numCultures - 1;}
		}
	},
	
	// GENERATE HISTORY
	// Randomly generates notable events and figures.
	// RIGHT NOW, IT WILL ONLY GENERATE WORLD EVENTS!
	generateHistory: function()
	{
		var yearsToGenerate = document.getElementById("input_YearsPerTurn").value;
		// Loop until out of years to generate
		// REMEMBER - THIS MEANS ALL THE CODE IS WRAPPED UP IN ONE BIG "i" FOR LOOP! THIS IS IMPORTANT!
		for(var i = 0; i < yearsToGenerate; i++)
		{
			// Determine how many events of note will occur this year!
			// Notable events should occur more often as the world modernizes and "grows."
			var eventAmountMod = (this.year / 1000);
				if(eventAmountMod < 1) {eventAmountMod = 0;}
			// Now, decide how many events to generate! 
			// Cultural history: AT LEAST one per year, plus up to one for every two cultures 
			//		(accelerating as time passes).
			var numberOfEvents = Math.floor((Math.random() * (0.1 + eventAmountMod) * this.cultures.length) +
				eventAmountMod + 1);
			// World history: About a 1/10 chance per year
			var worldEventCheck = Math.floor(Math.random() * 10);
			// Loop and generate historical events
			// First, a World History event, if one occurs
			/* if(worldEventCheck <= 1)
			{
				if(this.year < 0)
				{this.worldHistory.push("In the year " + (-1 * this.year) + " P.M.E. " + "I performed a test.");}
				else
				{this.worldHistory.push("In the year M.E. " + this.year + " " + "I performed a test.");}
			} */
			// Then, Cultural History events
			// REMEMBER THE "j" FOR LOOP TOO!
			for(var j = 0; j < numberOfEvents; j++)
			{
				// FIRST, randomize the event that will be picked (1-7)
				var eventPicker = Math.floor((Math.random() * 7) + 1);
				// SECOND, decide: Empire level, or Culture level?
				var empireOrCultureCheck = Math.random() * 5;
				// Base for all historical events
				var newHistString;
				if(this.year < 0) {newHistString = "In the year " + (this.year * -1) + " P.M.E., ";}
				else {newHistString = "In the year M.E. " + this.year + ", ";}
				// CULTURE-WIDE
				// Note that these will be considerably more common than empire-wide events
				if(empireOrCultureCheck <= 4)
				{
					// Decide the primary "recipient" of the event
					var whoGetsEvent = Math.floor(Math.random() * this.cultures.length);
					var selectedCulture = this.cultures[whoGetsEvent];
					// Then assign the event!
					// All history is stored as strings, with event details outlined below.
					switch(eventPicker)
					{
						// CULTURAL EVENTS
						case 1: if(!selectedCulture.inGoldenAge) {break;} // Great Artist, Author, Musician, Philosopher or Scientist
						case 2:			
							if(selectedCulture.inGoldenAge)
							{newHistString += "in the midst of the " + selectedCulture.name + " golden age, "}
						
							var greatPersonName = this.generateFullName();
							var whatKindOfGreat = Math.floor(Math.random() * 5) + 1;
							var firstGreatWorkSeed = Math.floor(Math.random() * 3);
							switch(whatKindOfGreat)
							{
								case 1:
									newHistString += ("the painter and sculptor " + greatPersonName +
										" began work as a professional artist.")
										
									selectedCulture.greatPeople.push("the artist " + greatPersonName);
									break;
								case 2:
									newHistString += ("the author " + greatPersonName);
									if(this.year < 1200 && firstGreatWorkSeed == 0)
									{
										newHistString += " published a novel which was both immensely popular and " +
											"groundbreaking from a literary standpoint.";
										selectedCulture.greatPeople.push("the author " + greatPersonName);
									}
									else if(firstGreatWorkSeed == 1)
									{
										newHistString += " wrote a play - the first of many - for a small acting troupe.";
										selectedCulture.greatPeople.push("the playwright " + greatPersonName);
									}
									else
									{
										newHistString += " published their first collection of poetry.";
										selectedCulture.greatPeople.push("the poet " + greatPersonName);
									}
									break;
								case 3:
									if(this.year < 1870)
									{
										newHistString += (greatPersonName + "'s first symphony was performed before an adoring audience!");
										selectedCulture.greatPeople.push("the composer " + greatPersonName);
									}
									else
									{
										newHistString += (greatPersonName + " and their band reached the top of the charts. " +
											"They would go on to revolutionize popular music.");
										selectedCulture.greatPeople.push("the singer/songwriter " + greatPersonName);
									}
									break;
								case 4:
									newHistString += (greatPersonName + " began a life of debate and introspection as a philosopher.")
									selectedCulture.greatPeople.push("the philosopher " + greatPersonName);
									break;
								case 5:
									if(firstGreatWorkSeed == 0)
									{
										if(this.year <= 1700)
										{
											newHistString += (greatPersonName + " wrote a treatise on the natural sciences.");
											selectedCulture.greatPeople.push("the scientist " + greatPersonName);
										}
										else if(Math.random() <= 0.5)
										{
											newHistString += (greatPersonName + " overturned the understanding of physics at the time!");
											selectedCulture.greatPeople.push("the physicist " + greatPersonName);
										}
										else
										{
											newHistString += (greatPersonName + " discovered several species never seen before!");
											selectedCulture.greatPeople.push("the biologist " + greatPersonName);
										}
									}
									else if(firstGreatWorkSeed == 1)
									{
										if(this.year <= 1700)
										{newHistString += (greatPersonName + " pioneered a new branch of mathematics!");}
										else
										{newHistString += (greatPersonName + " finally proved a theorem that had eluded mathematicians for years.");}
									
										selectedCulture.greatPeople.push("the mathematician " + greatPersonName);
									}
									else
									{
										var secondarySeed = Math.random();
										if(secondarySeed <= 0.33 && this.year >= 1790)
										{
											newHistString += (greatPersonName + " pioneered a new approach to psychology.");
											selectedCulture.greatPeople.push("the psychologist " + greatPersonName);
										}
										else if(Math.random() <= 0.66)
										{
											newHistString += (greatPersonName + " wrote their most influential treatise on economics.");
											selectedCulture.greatPeople.push("the economist " + greatPersonName);
										}
										else
										{
											newHistString += (greatPersonName + " wrote their most influential treatise on political theory.");
											selectedCulture.greatPeople.push("the political scientist " + greatPersonName);
										}
									}
									break;
							}
							
							selectedCulture.history.push(newHistString);
							break;
						// WARFARE EVENTS
						case 3: // War with other country on continent
							// Who is the target?
							var decideTarget = selectedCulture;
							// For now, only cultures on the same continent are valid targets.
							var selectedCont = selectedCulture.continent;
							// Pick a target, looping if the defender and attacker are the same.
							// Break early and move on if the loop runs more than 10 times.
							var maxLoop = 10;
							while(decideTarget == selectedCulture && maxLoop >= 1)
							{
								// Randomize defender
								decideTarget = selectedCont.cultures[Math.floor(Math.random() * selectedCont.cultures.length)];
								// decrement maxLoop
								maxLoop--;
							}
							if(maxLoop <= 0) {break;}
							
							// What is the justification for war?
							var whatCasusBelli = Math.floor((Math.random() * 2) + 1);
							switch(whatCasusBelli)
							{
								default:
									selectedCulture.startWar(this.year, true, selectedCulture, decideTarget, "war against ");
									break;
							}
							break;
						// RELIGIOUS EVENTS?
						case 4: // Polytheism -> Monotheism shift
								// POSSIBLE ADDITIONS: Monotheism -> Polytheism, Monotheism -> Atheism, Atheism -> either?
							// Just in case the same event fires twice (because neither conversion nor revolt occurs),
							// make sure it doesn't "go through" twice
							if(selectedCulture.currentRulerAttemptedReligiousShift)
							{break;}
							else{selectedCulture.currentRulerAttemptedReligiousShift = true;}
							
							if(selectedCulture.religion.gods.length > 1)
							{
								// Determine what god becomes the religion's supreme god
								var godAscendantSeed = (Math.floor(Math.random() * selectedCulture.religion.gods.length) + 1);
								var godAscendant = selectedCulture.religion.gods[godAscendantSeed - 1];
								// Determine whether monotheism becomes permanently dominant or not
								var successfulTransition = Math.floor(Math.random() * 100);
								// Success! The culture largely moves over to monotheism!
								if(successfulTransition >= 97 && selectedCulture.religion.heresyTolerance > -0.75)
								{
									// Add the ruler to cultural history
									newHistString += (selectedCulture.activeRulerTitle + " " + selectedCulture.rulerName +
										" " + selectedCulture.rulerSurname + " decided to venerate " + godAscendant +
										" as the one true god. Though hesitant at first, the people soon followed suit," +
										" casting aside their lesser gods! Glory to " + godAscendant + "!");
									selectedCulture.greatPeople.push(selectedCulture.rulerName +
										" the Emissary of " + godAscendant);
									selectedCulture.currentRulerIsGreatPerson = true;
										
									// Modify the religion accordingly - god list and name
									// We want to keep "gods" an array, even if there's only one, so tread carefully!
									selectedCulture.religion.gods = [];
									selectedCulture.religion.gods.push(godAscendant);
									if(godAscendantSeed == 0)
									{
										selectedCulture.religion.name = "Orthodox " + selectedCulture.religion.name;
									}
									else
									{
										selectedCulture.religion.name = selectedCulture.religion.gods[0];
										var lastletter = selectedCulture.religion.name[selectedCulture.religion.name.length - 1];
										if(lastletter != "a" && lastletter != "e" && lastletter != "i" && lastletter != "o" && lastletter != "u")
										{selectedCulture.religion.name += "ism";}
										else if(lastletter == "i") {selectedCulture.religion.name += "sm";}
										else {selectedCulture.religion.name += "nism";}
									}
									// Remember to update the religion so the "godsList" changes! Throw in an evangelism bonus
									// 		and a random change to heresyTolerance, as well.
									selectedCulture.religion.updateReligion(undefined, Math.random() * 1.2, Math.random() * 2 - 1);
								}
								// Failure! The culture executes those who pushed for monotheism!
								else if(selectedCulture.religion.heresyTolerance <= -0.25)
								{
									newHistString += (selectedCulture.activeRulerTitle + " " + selectedCulture.rulerName +
										" " + selectedCulture.rulerSurname + " decided to venerate " + godAscendant +
										" as the one true god. This caused tremendous unrest within the populace, who " +
										" soon revolted! ");
										
									if(selectedCulture.currentRulerIsGreatPerson)
									{
										newHistString += ("Due to their otherwise good reputation, the " + selectedCulture.activeRulerTitle +
											" was able to maintain order by promising to forsake their cult and promptly abdicate. ");
									}
									else if(selectedCulture.rulerChangeFrequency == "on death")
									{	
										newHistString += ("For their heresy, the ruling dynasty was ousted from power, " +
											"replaced by those who 'could be trusted to keep the true faith.'");
										selectedCulture.greatPeople.push(selectedCulture.activeRulerTitle + " " + selectedCulture.rulerName +
											" The Heretic");
											
										selectedCulture.changeRulerSurname(this.dictionary);
									}
									else
									{
										newHistString += ("The " + selectedCulture.activeRulerTitle + " soon 'abdicated,' " +
											"with runoff elections held to determine a (hopefully more orthodox) replacement.");
										selectedCulture.greatPeople.push(selectedCulture.activeRulerTitle + " " + selectedCulture.rulerName +
											" The Heretic");
									}
									
									// Prevent re-election for republics
									selectedCulture.numReelections = 100;
									// New ruler!
									selectedCulture.timeToRulerChange = 0;
								}
								// Failure! The culture is just sort of "eh" about the whole thing.
								else
								{
									newHistString += (selectedCulture.activeRulerTitle + " " + selectedCulture.rulerName +
										" " + selectedCulture.rulerSurname + " decided to venerate " + godAscendant +
										" as the one true god. This heresy was largely ignored by the populace, and");
										
									if(selectedCulture.rulerChangeFrequency == "on death")
									{	
										newHistString += (" within a few generations, the royal family had" +
										" returned to the mainstream polytheistic doctrine.");
									}
									else
									{
										if(selectedCulture.rulerIsFemale)
											{newHistString += (", with her successor unwilling to support the cult of " + godAscendant);}
										else
											{newHistString += (", with his successor unwilling to support the cult of " + godAscendant);}
										
										newHistString += ", the movement was quickly forgotten altogether.";
										
										// Prevent re-election
										selectedCulture.numReelections = 100;
									}
								}
								// Finally, record the event
								selectedCulture.history.push(newHistString);
							}
							break;
						// DIPLOMATIC EVENTS?
						case 5: // Forging/breaking alliances
						case 6: // This event is twice as likely to happen as most! Politics are fun!
							var allianceExists = false;
							var allianceArrayIndex = 0;
							// Who is the target?
							var decideTarget = selectedCulture;
							// Pick a target, looping if the (potential) ally and selectedCulture are the same.
							// Break early and move on if the loop runs more than 10 times.
							var maxLoop = 10;
							while(decideTarget == selectedCulture && maxLoop >= 1)
							{
								// Randomize defender
								decideTarget = this.cultures[Math.floor(Math.random() * this.cultures.length)];
								// decrement maxLoop
								maxLoop--;
							}
							if(maxLoop <= 0) {break;}
							
							// Is the target already the selectedCulture's ally?
							for(var k = 0; k < selectedCulture.allies.length; k++) // Note the use of "k". Remember earlier, when I mentioned that
							{														// all the "generateHistory" code is wrapped in one big for loop?
								if(selectedCulture.allies[k].name == decideTarget.name) // I didn't, for a while! Gotta be careful, there.
								{allianceExists = true; allianceArrayIndex = k;}
							}
							
							if(!allianceExists) 
							{
								newHistString += (selectedCulture.countryName + " forged an alliance with " +
									decideTarget.countryName + ".");
									
								selectedCulture.allies.push(decideTarget);
								selectedCulture.history.push(newHistString);
								// Don't forget to make the alliance mutual!
								decideTarget.allies.push(selectedCulture);
								decideTarget.history.push(newHistString);
							}
							// If so: possibly break the alliance!
							// Make this more likely for countries with more allies
							else if((Math.random() + (selectedCulture.allies.length * 0.15)) > 0.5) 
							{
								newHistString += (selectedCulture.countryName + " broke their alliance with " +
									decideTarget.countryName + ".");
									
								selectedCulture.allies.splice(allianceArrayIndex, 1);
								selectedCulture.history.push(newHistString);
									
								// Make the break mutual, too, of course.
								for(var k = 0; k < decideTarget.allies.length; k++)
								{
									if(decideTarget.allies[k].name == selectedCulture.name)
									{allianceArrayIndex = k;}
								}
								decideTarget.allies.splice(allianceArrayIndex, 1);
								decideTarget.history.push(newHistString);
							}
							break;
						// ECONOMIC EVENTS???
						// ENVIRONMENTAL EVENTS???
						// BEGINNING/ENDING OF A GOLDEN AGE
						default: // Also serves as case 7
							if(selectedCulture.inGoldenAge && 
								(selectedCulture.goldenAgeTracker <= 0)) // End of age
							{
								newHistString = "All good things must come to an end. By the year ";
								if(this.year < 0)
								{newHistString += (this.year * -1) + " P.M.E. ";}
								else {newHistString += "M.E. " + this.year + " ";}
								
								newHistString += (selectedCulture.countryName + " had entered into " +
									"a decline, and soon their golden age would be nothing but a memory.");
								selectedCulture.history.push(newHistString);
									
								selectedCulture.inGoldenAge = false;
								selectedCulture.goldenAgeTracker = 50; // Cooldown between golden ages
							}
							else if(!selectedCulture.inGoldenAge &&
								selectedCulture.goldenAgeTracker <= 0) // Start of age
							{
								newHistString += (selectedCulture.countryName +
									" entered a new golden age. Art, philosophy, science and more " +
									"flourished, and " + selectedCulture.rulerName + " " + 
									selectedCulture.rulerSurname + " will forever be known as the " +
									selectedCulture.rulerTitle + " who saw it ushered in!");
								selectedCulture.history.push(newHistString);
								
								// Record the ruler as a great person, if they haven't been already
								if(!selectedCulture.currentRulerIsGreatPerson)
								{
									selectedCulture.greatPeople.push(selectedCulture.rulerTitle + " " +
										selectedCulture.rulerName + " the Great");
									
									selectedCulture.currentRulerIsGreatPerson = true;
								}
								
								selectedCulture.inGoldenAge = true;
								selectedCulture.goldenAgeTracker = 10; // Minimum time before golden age ends
							}
						break;
					}
				}
				// EMPIRE-WIDE
				else
				{
					// Decide the primary "recipient" of the event
					var whoGetsEvent = Math.floor(Math.random() * this.empires.length);
					var selectedEmpire = this.empires[whoGetsEvent];
					// Then assign the event
					switch(eventPicker)
					{
						case 1: // Entering the empire
						case 2: // Twice as likely as leaving the empire (or any other event)!
							// Determine which cultures on the continent (if any) are not in the empire
							var nonIntegratedCultures = [];
							for(var k = 0; k < selectedEmpire.continent.cultures.length; k++)
							{
								var cultureNotInEmpire = true;
								
								for(var l = 0; l < selectedEmpire.cultures.length; l++)
								{
									if(selectedEmpire.cultures[l].name == selectedEmpire.continent.cultures[k].name)
									{cultureNotInEmpire = false;}
								}
								
								if(cultureNotInEmpire) {nonIntegratedCultures.push(selectedEmpire.continent.cultures[k]);}
							}
							
							// Pick a culture and add it to the empire
							if(nonIntegratedCultures.length > 0)
							{
								var culturePicker = Math.floor(Math.random() * nonIntegratedCultures.length);
								selectedEmpire.addCulture(nonIntegratedCultures[culturePicker]);
								// Add this to the history, as well
								newHistString += (nonIntegratedCultures[culturePicker].countryName + " joined the " +
									selectedEmpire.name + ".");
								selectedEmpire.history.push(newHistString);
								nonIntegratedCultures[culturePicker].history.push(newHistString);
							}
							break;
						case 3: // Leaving the empire
								// TO ADD: Wars of independence and possibly other skulduggery!
							var culturePicker = Math.floor(Math.random() * selectedEmpire.cultures.length);
							// Make sure the emperor never leaves the empire - what would be the incentive?
							if(selectedEmpire.cultures[culturePicker].isEmperor)
							{break;}
							// Add it to the history
							newHistString += (selectedEmpire.cultures[culturePicker].countryName + " cut ties with the " +
								selectedEmpire.name + " without incident.")
							selectedEmpire.history.push(newHistString);
							selectedEmpire.cultures[culturePicker].history.push(newHistString);
							// Remove the culture from the empire
							selectedEmpire.removeCulture(selectedEmpire.cultures[culturePicker]);
							break;
						default: 
					}
				}
			}
			
			// NON-RANDOM HISTORY
			// Increment the current year by 1 per year, obviously...
			this.year++;
			// ...and be sure to decrement timeToRulerChange for every culture and empire, as well as taking care of
			// 		any other non-random historical events.
			// Remember, we're still in a for loop, so "var i" is STILL TAKEN! Gave me a huge headache for a while.
			for(var j = 0; j < this.cultures.length; j++) 
			{
				this.cultures[j].newRulerCountdown(this.dictionary);
				
				// Auto-end golden ages after 150 years
				// ADD EXCEPTION FOR CULTURES IN AN *EMPIRE* EXPERIENCING A GOLDEN AGE?
				if(this.cultures[j].inGoldenAge && this.cultures[j].goldenAgeTracker <= -100)
				{
					var newHistString = "All good things must come to an end. By the year ";
					if(this.year < 0)
					{newHistString += (this.year * -1) + " P.M.E. ";}
					else {newHistString += "M.E. " + this.year + " ";}
								
					newHistString += (this.cultures[j].countryName + " had entered into " +
						"a decline, and soon their golden age would be nothing but a memory.");
					this.cultures[j].history.push(newHistString);
									
					this.cultures[j].inGoldenAge = false;
					this.cultures[j].goldenAgeTracker = 50; // Cooldown between golden ages
				}
				// Also, make extremely long golden ages substantially less likely, by accelerating decline after
				// 		the tracker hits 0
				else if(this.cultures[j].inGoldenAge && this.cultures[j].goldenAgeTracker <= 0)
				{this.cultures[j].goldenAgeTracker -= Math.floor(Math.random() * 25 + 5)}
			}
			for(var j = 0; j < this.empires.length; j++) {this.empires[j].newRulerCountdown(this.dictionary, false);}
		}
		
		// Once the Modern Era is entered, lower the increment and avoid "year zero"
		if(this.year == 0) {this.year++;}
		if(this.year > 0 && (this.year - yearsToGenerate) < 0) 
			{document.getElementById("input_YearsPerTurn").value = 15;}
		
		// List the new status of world history, cultures and empires
		this.listWorldHistory(); this.listEmpires(); this.listCultures();
	},
	
	// Mostly this is handled in other classes; this will only be used for brand new Great People.
	generateFullName: function()
	{
		var firstName = "";
		var lastName = "";
		
		var maxrand = this.dictionary.length;
		var num_syllables_first = Math.floor((Math.random() * 2) + 2);
		var num_syllables_last = Math.floor((Math.random() * 3) + 2);
		
		// First name
		for(var i = 0; i < num_syllables_first; i++)
		{
			var rand_syllable = Math.floor(Math.random() * maxrand)
			rand_syllable = this.dictionary[rand_syllable];
			
			if((rand_syllable[0] == "a" || rand_syllable[0] == "e" || 
				rand_syllable[0] == "i" || rand_syllable[0] == "o" ||
				rand_syllable[0] == "u" || rand_syllable[0] == "y") && 
				(firstName[firstName.length - 1] == "a" || firstName[firstName.length - 1] == "e" || 
				firstName[firstName.length - 1] == "i" || firstName[firstName.length - 1] == "o" || 
				firstName[firstName.length - 1] == "u" || firstName[firstName.length - 1] == "y" ))
				{rand_syllable = "-" + rand_syllable[0].toUpperCase() + rand_syllable.slice(1);}
				
			firstName += rand_syllable;
		}
		// Surname
		for(var i = 0; i < num_syllables_last; i++)
		{
			var rand_syllable = Math.floor(Math.random() * maxrand)
			rand_syllable = this.dictionary[rand_syllable];
			
			if((rand_syllable[0] == "a" || rand_syllable[0] == "e" || 
				rand_syllable[0] == "i" || rand_syllable[0] == "o" ||
				rand_syllable[0] == "u" || rand_syllable[0] == "y") && 
				(lastName[lastName.length - 1] == "a" || lastName[lastName.length - 1] == "e" || 
				lastName[lastName.length - 1] == "i" || lastName[lastName.length - 1] == "o" || 
				lastName[lastName.length - 1] == "u" || lastName[lastName.length - 1] == "y" ))
				{rand_syllable = rand_syllable.slice(1);}
				
			lastName += rand_syllable;
		}
		// Capitalization
		firstName = firstName[0].toUpperCase() + firstName.slice(1);
		lastName = lastName[0].toUpperCase() + lastName.slice(1);
		
		return (firstName + " " + lastName);
	}
}; // end app.Main