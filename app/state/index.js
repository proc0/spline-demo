'use strict';
import { R, B } from '../util';
import view from './view';
import * as actions from '../actions';

export default {
	//save context state and options
	init : function(context, options, sliders){
		//initialize UI controllers
		actions.slider.updateLabels(sliders);
		//bind all elements and their events to all actions
		R.mapObjIndexed(this.bindElements.bind(this), actions);
		//initialize view
		return view.init(context, options)
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

