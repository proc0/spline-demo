import { R, B } from '../tool';
import view from './view/core';
import state from './state/core';
import State from '../state/data/types/state';
import * as events from './input/ui';
/**
 * @type local :: World -> IO
 * @cyto app :: IO -> IO
 */
 export default (R.compose(init, state))();
// export default {
// 	core : R.compose(view.output, state.model, view.input, state.data),
// 	state : state,
// 	view : view
// }
// R.compose( R.flip(state)(view.input));

//initialize events
function init(state){
	
	var combine = R.compose(R.map(R.apply(R.call)), R.zip),
		extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
		//bind an array of elements to Bacon events
		bindElements = R.curry(function(handlers, elements){
			//use bindElement to bind to HTMLElement, bind to state Controller (not runtime)
			return R.map(R.curry(bindElement)(handlers).bind(state.data.meta), elements);
		}),
		bindEvents = extract(R.compose(bindElements, R.identity)),
		//bind all action creators to events
		initialize = R.converge(combine, [bindEvents, R.always(state.ui.elements)]);

	initialize(events);

	view.init(state);

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
						IO  	= R.ifElse(isState, view.output(this), noop),
						process = R.compose(IO, state, view.input(this));
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