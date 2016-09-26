// Handles onload + such

"use strict";

// if app exists use the existing copy; else create new object literal
var app = app || {};

window.onload = function()
{
	// Initialize main class
	console.log("window.onload called")
	app.Main.app = app; // call before init!
	app.Main.init();
} // end app.Loader