'use strict';
import { R, B, cyto } from './etc';
import cells from './cell';
import ios from './io';
import options from '../options';

var app = { 
		state : {
			options : options
		}, 
		input : cells, 
		output : ios 
	};

/**
 * @name Core
 * @type core :: IO()
 */
export default cyto(app)(init);

function init(app){
	var inputs = app.input,
		io = inputs[0],
		// comps = inputs[1],
		outputs = app.outputs,
		state = app.state,
		events = state.events,
		ui = state.ui;

	var getElement = function(className){ 
			return document.getElementsByClassName(className)[0]; 
		},
		//bind an element to a Bacon Events
		bindElement = function (event){

			return this;
		};

	R.map(function(comp){
		var element = getElement(comp.name),
			eventList = R.keys(io);

		R.mapObjIndexed(function(eventNames, handlerName){

			R.map(function(eventName){

				if(R.contains(eventName, eventList))
					B.fromEvent(element, eventName).onValue(bindElement);

			}, eventNames);
		}, comp.map);

	}, ui);

}

