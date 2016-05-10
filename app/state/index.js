'use strict';
import { R, B } from '../util';
import view from './view';
import * as actions from '../actions';

export default { init : init };

//save context state and options
function init(model){
	//initialize UI controllers
	actions.slider.updateLabels(model.sliders);
	//bind all elements and their events to all actions
	R.mapObjIndexed(bindElements, actions);
	//initialize view
	return view.init(model);
}

//bind an element to a Bacon Events
function bindElement(events, element){
	//closure arguments to map on events
	var mapEvent = function(handler, eventName){
		var metaHandler = function(event){
				//if handler returns a model, render it
				var model = handler.bind(events)(event);
				return model && view.render(model);
			};
		//only bind if handler is a function
		if('function' === typeof handler)
			//Bacon stream event from HTMLElement
			B.fromEvent(element, eventName).onValue(metaHandler);
	};
	//map element events by using the object
	//property name as the event name
	return R.mapObjIndexed(mapEvent, events);
}

//bind an array of elements to Bacon events
function bindElements(events, className){
	var elements = document.getElementsByClassName(className);
	//use bindElement to bind to HTMLElement
	return R.map(R.curry(bindElement)(events), elements);
}


