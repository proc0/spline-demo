'use strict';
import R from '../node_modules/ramda/dist/ramda';
import B from '../node_modules/baconjs/dist/Bacon';
import menu from './menu';
import * as elements from './elements/index';

export default {
	//save context state and options
	init : function(){
		var $sliders = document.getElementsByClassName('slider');
		//initialize UI controllers
		menu.updateLabels($sliders);
		//TODO: needs to be called twice to avoid offset?
		menu.updateLabels($sliders);
		//bind all events to all elements
		return R.mapObjIndexed(this.bindElements.bind(this), elements);
	},
	//bind an element to a Bacon Events
	bindElement : R.curry(function(events, element){
		var mapEvent = function(handler, event){
				//only bind if handler is a function
				return typeof handler === 'function' && B.fromEvent(element, event).onValue(handler.bind(events));
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

