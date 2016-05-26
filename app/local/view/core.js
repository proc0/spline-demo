'use strict';
import { R, B } from '../../tool';
import input from './input/core';
import output from './output/core';
import * as events from './input/ui';

var view = {};

export default function init(worldData){
	
	var dom = worldData.state;

	view.elements = initElements(dom)(events);
	view.context = dom.getElementsByClassName('canvas')[0].getContext('2d');

	return initEvents;
}

function initEvents(state){
	
	var currentState = state(),
		dom = currentState.world.state;

	var combine = R.compose(R.map(R.apply(R.call)), R.zip),
		extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
		//bind an array of elements to Bacon events
		bindElements = R.curry(function(handlers, elements){
			//use bindElement to bind to HTMLElement, bind to state Controller (not runtime)
			return R.map(R.curry(bindElement)(handlers).bind(state()), elements);
		}),
		bindEvents = extract(R.compose(bindElements, R.identity)),
		//bind all action creators to events
		initialize = R.converge(combine, [bindEvents, R.always(view.elements)]);

	view.handle = input;
	view.render = output(view);

	currentState.view = view;

	return initialize(events);
	// view.init(state);

	//initialize UI controllers
	//TODO: propagate and properly abstract
	//init function to all event handlers
	// events.slider.init(state);

	// return view;
}

//bind an element to a Bacon Events
function bindElement(handlers, element){
	//bound to state
	var state = this,
		_bind = function(handler, eventName){
			//meta handler uses handler closure
			var trigger = function(event){
					var noop 	= function(){ return; },
						isState = function(s){ return s instanceof State },
						//only render if model returns State
						render  = R.ifElse(isState, view.render(state), noop),
						process = R.compose(render, R.flip(R.apply)(view.handle), state);
					//process :: IO -> IO
					//w/ current event and prev state
					return process(event);
				};
			//only bind if handler is a function
			if('function' === typeof handler)
				//Bacon stream event from HTMLElement
				B.fromEvent(element, eventName).onValue(trigger);
		};
	//map element handlers by using the object
	//property name as the event name
	return R.mapObjIndexed(_bind, handlers);
}

//attach UI elements to state
function initElements(dom){
	var extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
		getElements = extract(function(handlers, className){ 
			return dom.getElementsByClassName(className); 
		});

	return getElements;
}
