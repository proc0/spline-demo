'use strict';
import { R, B } from './util';
import * as elements from './elements';

export default {
	//save context state and options
	init : function(sliders){
		//initialize UI controllers
		elements.slider.init(sliders);
		//bind all events to all elements
		return R.mapObjIndexed(this.bindElements.bind(this), elements);
	},
	//bind an element to a Bacon Events
	bindElement : R.curry(function(events, element){
		var mapEvent = function(handler, event){
				//only bind if handler is a function
				if(typeof handler === 'function')
					return B.fromEvent(element, event)
								.onValue(handler.bind(events));
			};
		return R.mapObjIndexed(mapEvent, events);
	}),
	//bind an array of elements to Bacon events
	bindElements : function(events, className){
		var elements = document.getElementsByClassName(className),
			bindEvents = this.bindElement(events);
		return R.map(bindEvents, elements);
	}
};

