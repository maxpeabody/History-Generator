/* HistoryEvent.js
IIFE as object

Represents a major event in the history of a culture/empire or the
world as a whole.

Might not be needed, though! Entire event can probably be represented 
as a string... keep this class around just in case, though. */
"use strict";

// if app exists use the existing copy; else create new object literal
var app = app || {};

app.HistoryEvent = function()
{
	// Constructor
	// MAY NOT NEED: Location, eventID.
	function HistoryEvent(year, location, eventID, description)
	{
		this.year = year;
		if(location) {this.location = location;}
			else {this.location = "global";}
		
		this.eventID = eventID;
		this.description = description;
	}
	
	// Prototype it and give it functions
	var h = HistoryEvent.prototype;
	
	return HistoryEvent;
}(); // end app.HistoryEvent