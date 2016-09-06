'use strict';
import { cyto, R, B } from './meta';
import input from './input/core';
import output from './output/core';
import options from '../options';

var app = { 
		state : {
			options : options
		}, 
		input : input, 
		output : output 
	};
/**
 * @name Core
 * @type core :: IO()
 */
export default cyto(app)(init);

function init(app){
	console.log(app);
	// return R.pipe(app.input, app.output)(app.state);
}
// //should only be called once
// function init(state){
	
// 	var view = state.view,
// 		events = view.events,

// 		combine = R.compose(R.map(R.apply(R.call)), R.zip),
// 		extract = R.compose(R.apply(R.compose), R.prepend(R.values), R.of, R.mapObjIndexed), 
// 		//bind an array of elements to Bacon events
// 		bindElements = R.curry(function(handlers, elements){
// 			//use bindElement to bind to HTMLElement, bind to state Controller (not runtime)
// 			return R.map(R.curry(bindElement)(handlers).bind(state.data.meta), elements);
// 		}),
// 		bindEvents = extract(R.compose(bindElements, R.identity)),
// 		//bind all action creators to events
// 		initialize = R.converge(combine, [bindEvents, R.always(state.ui.elements)]);

// 	initialize(events);
// }

// //bind an array of elements to Bacon events
function bindEvents(state){
	var _bind = R.curry(function(handlers, elements){
		//use bindEvent to bind to HTMLElement, bind to state Controller (not runtime)
		return R.map(R.curry(bindEvent)(handlers).bind(state), elements);
	});
	//bind each ui element to the reducer function
	return R.compose(_bind, R.identity);
}


// //bind an element to a Bacon Events
// function bindEvent(handlers, element){
// 		//get state
// 	var state = this(),
// 		State = state.meta,
// 		view = state.view,
// 		noop = Function.prototype,
// 		//process ui input
// 		I = R.flip(R.apply)(view.input),
// 		//only render if output is State
// 		O = R.ifElse(State, view.output, noop),
// 	/** IO :: IO -> IO ;-- StateMonad <- Input
// 	 * ---------------------------------------------- */
// 		IO = R.compose(O, I, this), 
// 		//IO = R.pipe(this, I, O) works?
// 		baconWrap = function(handler, event){
// 			//only bind if handler is a function
// 			if('function' === typeof handler)
// 				//Bacon stream event from HTMLElement
// 				B.fromEvent(element, event).onValue(IO);
// 		};
// 	//map element handlers by using the object
// 	//property name as the event name
// 	return R.mapObjIndexed(baconWrap, handlers);
// }

