'use strict';
import { R, B } from '../../tool';
import input from './input/core';
import output from './output/core';
import * as events from './input/ui';

export default function init(worldData, state){
	
	state = initElements(worldData, state);

	var combine = R.compose(R.map(R.apply(R.call)), R.zip),
		extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
		//bind an array of elements to Bacon events
		bindElements = R.curry(function(handlers, elements){
			//use bindElement to bind to HTMLElement, bind to state Controller (not runtime)
			return R.map(R.curry(bindElement)(handlers).bind(state), elements);
		}),
		bindEvents = extract(R.compose(bindElements, R.identity)),
		//bind all action creators to events
		initialize = R.converge(combine, [bindEvents, R.always(state.view.elements)]);

	state.output = output(state);

	initialize(events);

	// view.init(state);

	//initialize UI controllers
	//TODO: propagate and properly abstract
	//init function to all event handlers
	events.slider.init(state);

	return state;
}

//bind an element to a Bacon Events
function bindElement(handlers, element){
	//bound to state
	var state = this,
		_bind = function(handler, eventName){
			//meta handler uses handler closure
			var trigger = function(event){
				//todo insert data abstraction layer
				// //here
				// 	var prev 	= state.get(),
				// 		State 	= state.State,
				// 		next 	= state.set.bind(state),
				// 		handle 	= handler.bind(handlers),
					var noop 	= function(){ return; },
						isState = function(s){ return s instanceof State },
						//only render if model returns State
						IO  	= R.ifElse(isState, state.output(state), noop),
						process = R.compose(IO, state, state.input(state));
					//process = input -> state -> IO 
					//w/ current event and prev state
					return process(event, prev);
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
function initElements(worldData, state){
	var dom = worldData.state,
		extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
		getElements = extract(function(handlers, className){ 
			return dom.getElementsByClassName(className); 
		});

	state.view.elements = getElements(events);

	return state;
}

/**
 * @type init :: State -> IO
//  */
// function init(state){
// 		//load view properties to be used when rendering 
// 		//and other view tasks, uses Assignable convention
// 	var load = R.mapObjIndexed(function(loader, prop){ 
// 			return this[prop] = loader.bind(this)(state.context); 
// 		}.bind(state.ui.view)),
// 		//render default state		
// 		initView = R.compose(render, initEvents, initElements);

// 	return load(props) && initView(state);
// }
// var hasInit;

// export default function(state){
// 	if(!hasInit){
// 		init(state);
// 		hasInit = true;
// 	}
// 	// if(state instanceof State)
// 	// 	output(state);
// 	// else
// 	// 	input(state);
// }

